import { prisma } from '../lib/prisma'
import type {
  AnalyticsOverview,
  MessageDataPoint,
  SessionDataPoint,
  AnalyticsQuery,
} from '@chatbot/shared'

async function assertOwnership(orgId: string, chatbotId: string): Promise<void> {
  const chatbot = await prisma.chatbotInstance.findFirst({ where: { id: chatbotId, orgId } })
  if (!chatbot) throw { statusCode: 404, message: 'Chatbot not found' }
}

export async function getOverview(
  orgId: string,
  chatbotId: string,
  query: AnalyticsQuery
): Promise<AnalyticsOverview> {
  await assertOwnership(orgId, chatbotId)

  const from = new Date(query.from)
  const to = new Date(query.to)

  const conversations = await prisma.conversation.findMany({
    where: { chatbotInstanceId: chatbotId, createdAt: { gte: from, lte: to } },
    include: { messages: { where: { createdAt: { gte: from, lte: to } } } },
  })

  const allMessages = conversations.flatMap((c) => c.messages)
  const assistantMsgs = allMessages.filter((m) => m.role === 'assistant')
  const latencies = assistantMsgs
    .filter((m) => m.latencyMs !== null)
    .map((m) => m.latencyMs as number)
  const avgLatency =
    latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0
  const uniqueUsers = new Set(conversations.map((c) => c.browserSessionId)).size

  return {
    totalMessages: allMessages.length,
    totalConversations: conversations.length,
    totalUniqueUsers: uniqueUsers,
    avgMessagesPerConversation:
      conversations.length > 0 ? allMessages.length / conversations.length : 0,
    avgResponseLatencyMs: avgLatency,
    periodStart: from.toISOString(),
    periodEnd: to.toISOString(),
  }
}

export async function getMessageAnalytics(
  orgId: string,
  chatbotId: string,
  query: AnalyticsQuery
): Promise<MessageDataPoint[]> {
  await assertOwnership(orgId, chatbotId)

  const from = new Date(query.from)
  const to = new Date(query.to)
  const period = query.period ?? 'day'

  const messages = await prisma.message.findMany({
    where: {
      conversation: { chatbotInstanceId: chatbotId },
      createdAt: { gte: from, lte: to },
    },
    orderBy: { createdAt: 'asc' },
  })

  const grouped = new Map<string, MessageDataPoint>()
  for (const msg of messages) {
    const date =
      period === 'hour'
        ? msg.createdAt.toISOString().slice(0, 13) + ':00:00.000Z'
        : msg.createdAt.toISOString().slice(0, 10)

    if (!grouped.has(date)) {
      grouped.set(date, { date, totalMessages: 0, userMessages: 0, assistantMessages: 0 })
    }
    const point = grouped.get(date)!
    point.totalMessages++
    if (msg.role === 'user') point.userMessages++
    else point.assistantMessages++
  }

  return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getSessionAnalytics(
  orgId: string,
  chatbotId: string,
  query: AnalyticsQuery
): Promise<SessionDataPoint[]> {
  await assertOwnership(orgId, chatbotId)

  const from = new Date(query.from)
  const to = new Date(query.to)
  const period = query.period ?? 'day'

  const conversations = await prisma.conversation.findMany({
    where: { chatbotInstanceId: chatbotId, createdAt: { gte: from, lte: to } },
    orderBy: { createdAt: 'asc' },
  })

  const grouped = new Map<string, SessionDataPoint>()
  const seenSessions = new Set<string>()

  for (const conv of conversations) {
    const date =
      period === 'hour'
        ? conv.createdAt.toISOString().slice(0, 13) + ':00:00.000Z'
        : conv.createdAt.toISOString().slice(0, 10)

    if (!grouped.has(date)) {
      grouped.set(date, { date, totalSessions: 0, newSessions: 0 })
    }
    const point = grouped.get(date)!
    point.totalSessions++
    if (!seenSessions.has(conv.browserSessionId)) {
      point.newSessions++
      seenSessions.add(conv.browserSessionId)
    }
  }

  return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date))
}
