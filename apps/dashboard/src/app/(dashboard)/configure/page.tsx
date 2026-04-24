'use client'

import { useState } from 'react'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { Group, Select, SegmentedControl, Center, Text, Stack, ThemeIcon, Button, Paper, Textarea, TextInput } from '@mantine/core'
import { PageShell } from '@/components/layout/page-shell'
import { MessageChart } from '@/components/analytics/message-chart'
import { SessionChart } from '@/components/analytics/session-chart'
import { OverviewCards } from '@/components/analytics/overview-cards'
import { useListChatbots } from '@/hooks/use-chatbots'
import { useMessageAnalytics, useSessionAnalytics, useAnalyticsOverview } from '@/hooks/use-analytics'
import { IconRobot } from '@tabler/icons-react'
import Link from 'next/link'
import { useListLLMKeys } from '@/hooks/use-llm-keys'
import { LLMProvider } from '@chatbot/shared'

type Range = '7d' | '30d' | '90d'
const RANGES: Record<Range, number> = { '7d': 7, '30d': 30, '90d': 90 }

export default function AnalyticsPage() {
  const { data: chatbots } = useListChatbots()
  const llms = ['openai', 'anthropic']
  const [selectedLlm, setSelectedLlm] = useState<string | null>(llms[0])
  const [range, setRange] = useState<Range>('30d')

  const query = {
    from: startOfDay(subDays(new Date(), RANGES[range])).toISOString(),
    to: endOfDay(new Date()).toISOString(),
    period: 'day' as const,
  }

  // const { data: overview } = useAnalyticsOverview(chatbotId, query)
  // const { data: messages } = useMessageAnalytics(chatbotId, query)
  // const { data: sessions } = useSessionAnalytics(chatbotId, query)

  return (
    <PageShell
      title="Configure"
      description="Configure your chatbot"
      action={
        <Group gap="sm">
          {llms && llms.length > 0 && (
            <Select
              w={220}
              size="xs"
              placeholder="Select LLM"
              value={selectedLlm}
              onChange={(l) => setSelectedLlm(l)}
              data={llms}
              searchable
            />
          )}
        </Group>
      }
    >
      <Paper>
        <Textarea
          // label="System Prompt"
          placeholder="Write what you business is about to set context for chatbot."
          rows={3} mb={'md'}
        />
        <TextInput placeholder='Paste the URL of your website to create context' />
      </Paper>
      {!selectedLlm && (
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
      )}
    </PageShell>
  )
}
