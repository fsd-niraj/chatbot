import cron from 'node-cron'
import { prisma } from '../lib/prisma'

export async function runAnalyticsJob(): Promise<void> {
  const now = new Date()
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  // Truncate to the start of the completed hour window
  const periodStart = new Date(
    hourAgo.getFullYear(),
    hourAgo.getMonth(),
    hourAgo.getDate(),
    hourAgo.getHours()
  )

  const chatbots = await prisma.chatbotInstance.findMany({ select: { id: true } })

  for (const chatbot of chatbots) {
    const conversations = await prisma.conversation.findMany({
      where: {
        chatbotInstanceId: chatbot.id,
        createdAt: { gte: hourAgo, lte: now },
      },
      include: {
        messages: { where: { createdAt: { gte: hourAgo, lte: now } } },
      },
    })

    const allMessages = conversations.flatMap((c) => c.messages)
    const assistantMsgs = allMessages.filter((m) => m.role === 'assistant')
    const latencies = assistantMsgs
      .filter((m) => m.latencyMs !== null)
      .map((m) => m.latencyMs as number)
    const avgLatency =
      latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0
    const uniqueUsers = new Set(conversations.map((c) => c.browserSessionId)).size

    const metrics = {
      totalMessages: allMessages.length,
      totalConversations: conversations.length,
      totalUniqueUsers: uniqueUsers,
      avgResponseLatencyMs: avgLatency,
      periodStart: hourAgo.toISOString(),
      periodEnd: now.toISOString(),
    }

    await prisma.analyticsSnapshot.upsert({
      where: {
        chatbotInstanceId_date_period: {
          chatbotInstanceId: chatbot.id,
          date: periodStart,
          period: 'hour',
        },
      },
      update: { metrics },
      create: {
        chatbotInstanceId: chatbot.id,
        date: periodStart,
        period: 'hour',
        metrics,
      },
    })
  }
}

export function startAnalyticsJob(): void {
  cron.schedule('0 * * * *', async () => {
    console.log('[analytics] Running hourly analytics job...')
    try {
      await runAnalyticsJob()
      console.log('[analytics] Job complete')
    } catch (err) {
      console.error('[analytics] Job failed:', err)
    }
  })
}
