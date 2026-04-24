'use client'

import { useRouter } from 'next/navigation'
import { Box } from '@mantine/core'
import { PageShell } from '@/components/layout/page-shell'
import { ChatbotForm } from '@/components/chatbot/chatbot-form'
import { useCreateChatbot } from '@/hooks/use-chatbots'
import type { CreateChatbotRequest } from '@chatbot/shared'

export default function NewChatbotPage() {
  const router = useRouter()
  const createChatbot = useCreateChatbot()

  async function handleSubmit(data: CreateChatbotRequest) {
    const bot = await createChatbot.mutateAsync(data)
    router.push(`/chatbots/${bot.id}`)
  }

  return (
    <PageShell title="New Chatbot" description="Set up a new chatbot instance">
      <Box maw={680}>
        <ChatbotForm onSubmit={handleSubmit} isLoading={createChatbot.isPending} />
      </Box>
    </PageShell>
  )
}
