/**
 * Analytics Worker — standalone consumer process.
 *
 * Run with:   ts-node-dev --transpile-only src/workers/analytics.worker.ts
 * Or in prod: node dist/workers/analytics.worker.js
 *
 * Consumes from analytics.queue, persists raw events to the `events` table,
 * and nacks unprocessable messages to the DLQ.
 */

import 'reflect-metadata'
import dotenv from 'dotenv'
dotenv.config()

import amqplib from 'amqplib'
import type { AnalyticsEvent } from '@chatbot/shared'
import { prisma } from '../lib/prisma'
import { setupTopology, QUEUE, DLQ } from '../lib/rabbitmq'

const RABBITMQ_URL = process.env.RABBITMQ_URL ?? 'amqp://chatbot:chatbot_secret@localhost:5672'
const PREFETCH = 10   // process up to 10 messages concurrently

// ---------------------------------------------------------------------------
// Event handlers — one per event type
// ---------------------------------------------------------------------------

async function handleEvent(event: AnalyticsEvent): Promise<void> {
  // Persist the raw event for audit trail and ad-hoc queries
  await prisma.event.create({
    data: {
      id:         event.eventId,
      type:       event.type,
      chatbotId:  event.chatbotId,
      orgId:      event.orgId,
      payload:    event as object,
      occurredAt: new Date(event.occurredAt),
    },
  })
}

// ---------------------------------------------------------------------------
// Consumer bootstrap
// ---------------------------------------------------------------------------

async function start(): Promise<void> {
  await prisma.$connect()
  console.log('[worker] Database connected')

  const connection = await amqplib.connect(RABBITMQ_URL)
  const channel = await connection.createChannel()

  await setupTopology(channel)
  await channel.assertQueue(DLQ, { durable: true })

  channel.prefetch(PREFETCH)

  console.log(`[worker] Consuming from ${QUEUE}`)

  channel.consume(QUEUE, async (msg) => {
    if (!msg) return

    let event: AnalyticsEvent | null = null

    try {
      event = JSON.parse(msg.content.toString()) as AnalyticsEvent
      await handleEvent(event)
      channel.ack(msg)
      console.log(`[worker] Processed ${event.type} (${event.eventId})`)
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err)
      console.error(`[worker] Failed to process message:`, errMsg)
      // nack without requeue — message goes to DLQ
      channel.nack(msg, false, false)
    }
  })

  const shutdown = async () => {
    console.log('[worker] Shutting down...')
    await channel.close()
    await connection.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start().catch((err) => {
  console.error('[worker] Fatal error:', err)
  process.exit(1)
})
