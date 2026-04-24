'use client'

import Link from 'next/link'
import {
  Button,
  SimpleGrid,
  Skeleton,
  Stack,
  Center,
  Text,
  Box,
  ThemeIcon,
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { IconPlus, IconRobot } from '@tabler/icons-react'
import { PageShell } from '@/components/layout/page-shell'
import { ChatbotCard } from '@/components/chatbot/chatbot-card'
import { useListChatbots, useDeleteChatbot } from '@/hooks/use-chatbots'

export default function ChatbotsPage() {
  const { data: chatbots, isLoading } = useListChatbots()
  const deleteChatbot = useDeleteChatbot()

  function handleDelete(id: string) {
    modals.openConfirmModal({
      title: 'Delete chatbot',
      children: (
        <Text size="sm">
          Are you sure you want to delete this chatbot instance? This cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteChatbot.mutate(id),
    })
  }

  return (
    <PageShell
      title="Chatbots"
      description="Create and manage your AI chatbot instances"
      action={
        <Button component={Link} href="/chatbots/new" size="sm" leftSection={<IconPlus size={16} stroke={2} />}>
          New Chatbot
        </Button>
      }
    >
      {isLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} height={160} radius="md" />
          ))}
        </SimpleGrid>
      ) : chatbots?.length === 0 ? (
        <Center
          py={80}
        >
          <Stack align="center" gap="md">
            <ThemeIcon size={56} radius="xl" variant="light">
              <IconRobot size={28} stroke={1.5} />
            </ThemeIcon>
            <Stack align="center" gap={4}>
              <Text fw={600} size="md">No chatbots yet</Text>
              <Text size="sm" c="dimmed" maw={300} ta="center">
                Create your first chatbot instance and embed it on any website in minutes.
              </Text>
            </Stack>
            <Button component={Link} href="/chatbots/new" size="sm" mt="xs">
              Create your first chatbot
            </Button>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {chatbots?.map((bot) => (
            <ChatbotCard key={bot.id} chatbot={bot} onDelete={handleDelete} />
          ))}
        </SimpleGrid>
      )}
    </PageShell>
  )
}
