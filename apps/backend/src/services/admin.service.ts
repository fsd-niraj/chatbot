import { prisma } from '../lib/prisma'
import type { Organization, AdminStats } from '@chatbot/shared'

export async function listOrganizations(): Promise<Organization[]> {
  const orgs = await prisma.organization.findMany({ orderBy: { createdAt: 'desc' } })
  return orgs.map((org) => ({
    id: org.id,
    name: org.name,
    createdAt: org.createdAt.toISOString(),
    updatedAt: org.updatedAt.toISOString(),
  }))
}

export async function getStats(): Promise<AdminStats> {
  const [totalOrganizations, totalChatbotInstances, totalMessages, totalConversations] =
    await Promise.all([
      prisma.organization.count(),
      prisma.chatbotInstance.count(),
      prisma.message.count(),
      prisma.conversation.count(),
    ])

  return { totalOrganizations, totalChatbotInstances, totalMessages, totalConversations }
}
