'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { SegmentedControl, Center, Text, Box } from '@mantine/core'
import { PageShell } from '@/components/layout/page-shell'
import { OverviewCards } from '@/components/analytics/overview-cards'
import { MessageChart } from '@/components/analytics/message-chart'
import { SessionChart } from '@/components/analytics/session-chart'
import { useAnalyticsOverview, useMessageAnalytics, useSessionAnalytics } from '@/hooks/use-analytics'
import { useGetChatbot } from '@/hooks/use-chatbots'

type Range = '7d' | '30d' | '90d'
const RANGES: Record<Range, number> = { '7d': 7, '30d': 30, '90d': 90 }

export default function ChatbotAnalyticsPage() {
  const { id } = useParams<{ id: string }>()
  const [range, setRange] = useState<Range>('30d')
  const { data: chatbot } = useGetChatbot(id)

  const query = {
    from: startOfDay(subDays(new Date(), RANGES[range])).toISOString(),
    to: endOfDay(new Date()).toISOString(),
    period: 'day' as const,
  }

  const { data: overview } = useAnalyticsOverview(id, query)
  const { data: messages } = useMessageAnalytics(id, query)
  const { data: sessions } = useSessionAnalytics(id, query)

  return (
    <PageShell
      title={`${chatbot?.name ?? '…'} Analytics`}
      description="Message and session metrics for this chatbot"
      action={
        <SegmentedControl
          size="xs"
          value={range}
          onChange={(v) => setRange(v as Range)}
          data={Object.keys(RANGES).map((r) => ({ value: r, label: r }))}
        />
      }
    >
      {overview && <OverviewCards data={overview} />}
      {messages && messages.length > 0 && <MessageChart data={messages} />}
      {sessions && sessions.length > 0 && <SessionChart data={sessions} />}
      {!overview && (
        <Center
          h={160}
          style={{
            border: '2px dashed var(--mantine-color-default-border)',
            borderRadius: 'var(--mantine-radius-md)',
          }}
        >
          <Text size="sm" c="dimmed">No data for this period yet.</Text>
        </Center>
      )}
    </PageShell>
  )
}
