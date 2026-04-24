import { randomUUID } from 'crypto'
import type { AnalyticsEvent } from '@chatbot/shared'
import { getChannel, EXCHANGE, ROUTING_KEY_PREFIX } from './rabbitmq'

// Omit<UnionType, K> only keeps keys common to all union members.
// This distributive form correctly preserves each variant's specific fields.
type DistributiveOmit<T, K extends keyof any> = T extends unknown ? Omit<T, K> : never

/**
 * Builds and publishes an analytics event to RabbitMQ.
 *
 * Fire-and-forget — errors are logged but never thrown so they cannot
 * affect the caller's request path.
 *
 * @param partial  All fields of the target event *except* `eventId` and
 *                 `occurredAt`, which are injected automatically.
 */
export function publishEvent(
  partial: DistributiveOmit<AnalyticsEvent, 'eventId' | 'occurredAt'>
): void {
  const event: AnalyticsEvent = {
    ...partial,
    eventId: randomUUID(),
    occurredAt: new Date().toISOString(),
  } as AnalyticsEvent

  // Non-blocking — intentionally not awaited
  sendEvent(event).catch((err) => {
    console.error(`[event-publisher] Failed to publish ${event.type}:`, err.message)
  })
}

async function sendEvent(event: AnalyticsEvent): Promise<void> {
  const channel = await getChannel()
  const routingKey = `${ROUTING_KEY_PREFIX}${event.type}`
  const body = Buffer.from(JSON.stringify(event))

  channel.publish(EXCHANGE, routingKey, body, {
    persistent: true,          // survive broker restarts
    contentType: 'application/json',
    messageId: event.eventId,
    timestamp: Math.floor(Date.now() / 1000),
  })
}
