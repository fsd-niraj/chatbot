import { Card, SimpleGrid, Text, Group, ThemeIcon, Stack } from '@mantine/core'
import {
  IconMessage,
  IconActivity,
  IconUsers,
  IconClock,
} from '@tabler/icons-react'
import { formatMs } from '@/lib/utils'
import type { AnalyticsOverview } from '@chatbot/shared'

interface OverviewCardsProps {
  data: AnalyticsOverview
}

const CARD_CONFIGS = [
  { key: 'totalMessages' as const, label: 'Messages', icon: IconMessage, color: 'blue' },
  { key: 'totalConversations' as const, label: 'Conversations', icon: IconActivity, color: 'blue' },
  { key: 'totalUniqueUsers' as const, label: 'Unique Users', icon: IconUsers, color: 'teal' },
  { key: 'avgResponseLatencyMs' as const, label: 'Avg Latency', icon: IconClock, color: 'orange' },
]

export function OverviewCards({ data }: OverviewCardsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      {CARD_CONFIGS.map(({ key, label, icon: Icon, color }) => {
        const rawValue = data[key]
        const value =
          key === 'avgResponseLatencyMs'
            ? formatMs(rawValue)
            : rawValue.toLocaleString()
        const sub =
          key === 'totalMessages'
            ? `${data.avgMessagesPerConversation.toFixed(1)} per conv`
            : null

        return (
          <Card key={key} padding="lg">
            <Group justify="space-between" align="flex-start" mb="sm">
              <Text size="sm" c="dimmed" fw={500}>
                {label}
              </Text>
              <ThemeIcon size={32} radius="md" variant="light" color={color}>
                <Icon size={16} stroke={1.75} />
              </ThemeIcon>
            </Group>
            <Stack gap={2}>
              <Text size="xl" fw={700} lh={1}>
                {value}
              </Text>
              {sub && (
                <Text size="xs" c="dimmed">
                  {sub}
                </Text>
              )}
            </Stack>
          </Card>
        )
      })}
    </SimpleGrid>
  )
}
