import amqplib from 'amqplib'

// ---------------------------------------------------------------------------
// Exchange / queue topology
// ---------------------------------------------------------------------------
export const EXCHANGE = 'analytics.events'
export const QUEUE = 'analytics.queue'
export const DLQ = 'analytics.dlq'
export const ROUTING_KEY_PREFIX = 'event.'

// ---------------------------------------------------------------------------
// Singleton connection + channel
// ---------------------------------------------------------------------------
let connection: amqplib.ChannelModel | null = null
let channel: amqplib.Channel | null = null

function getRabbitMQUrl(): string {
  return process.env.RABBITMQ_URL ?? 'amqp://chatbot:chatbot_secret@localhost:5672'
}

/**
 * Returns a ready publisher channel, creating the connection if needed.
 * Safe to call multiple times — returns the cached channel.
 */
export async function getChannel(): Promise<amqplib.Channel> {
  if (channel) return channel

  const conn = await amqplib.connect(getRabbitMQUrl())
  connection = conn
  const ch = await conn.createChannel()
  channel = ch

  await setupTopology(ch)

  conn.on('error', (err) => {
    console.error('[rabbitmq] Connection error:', err.message)
    channel = null
    connection = null
  })

  conn.on('close', () => {
    console.warn('[rabbitmq] Connection closed — will reconnect on next publish')
    channel = null
    connection = null
  })

  return ch
}

/**
 * Declares the exchange, DLQ, and main queue with dead-letter routing.
 * Idempotent — safe to call on every connect.
 */
export async function setupTopology(ch: amqplib.Channel): Promise<void> {
  // Topic exchange: routing key = event.<event_type>
  await ch.assertExchange(EXCHANGE, 'topic', { durable: true })

  // Dead-letter queue — messages that fail max retries land here
  await ch.assertQueue(DLQ, { durable: true })

  // Main analytics queue — bound to all event.* routing keys
  await ch.assertQueue(QUEUE, {
    durable: true,
    arguments: {
      'x-dead-letter-exchange': '',        // default exchange
      'x-dead-letter-routing-key': DLQ,
    },
  })

  await ch.bindQueue(QUEUE, EXCHANGE, `${ROUTING_KEY_PREFIX}*`)
}

/**
 * Gracefully closes the connection. Call during server shutdown.
 */
export async function closeRabbitMQ(): Promise<void> {
  try {
    await channel?.close()
    await connection?.close()
  } catch {
    // ignore errors on shutdown
  } finally {
    channel = null
    connection = null
  }
}
