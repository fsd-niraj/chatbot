'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Card,
  SimpleGrid,
  Skeleton,
  Group,
  Text,
  ThemeIcon,
  Stack,
} from '@mantine/core'
import {
  IconBuilding,
  IconRobot,
  IconMessage,
  IconActivity,
} from '@tabler/icons-react'
import { PageShell } from '@/components/layout/page-shell'
import api from '@/lib/api'
import { ENDPOINTS } from '@chatbot/shared'
import type { AdminStats } from '@chatbot/shared'

function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.ADMIN_STATS)
      return res.data
    },
  })
}

const STAT_CONFIGS = [
  { key: 'totalOrganizations' as const, label: 'Organizations', icon: IconBuilding, color: 'blue' },
  { key: 'totalChatbotInstances' as const, label: 'Chatbot Instances', icon: IconRobot, color: 'blue' },
  { key: 'totalMessages' as const, label: 'Total Messages', icon: IconMessage, color: 'teal' },
  { key: 'totalConversations' as const, label: 'Conversations', icon: IconActivity, color: 'orange' },
]

export default function AdminStatsPage() {
  const { data: stats, isLoading } = useAdminStats()

  return (
    <PageShell title="Platform Stats" description="Global usage metrics">
      {isLoading ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={120} radius="md" />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
          {STAT_CONFIGS.map(({ key, label, icon: Icon, color }) => (
            <Card key={key} padding="lg">
              <Group justify="space-between" align="flex-start" mb="sm">
                <Text size="sm" c="dimmed" fw={500}>
                  {label}
                </Text>
                <ThemeIcon size={32} radius="md" variant="light" color={color}>
                  <Icon size={16} stroke={1.75} />
                </ThemeIcon>
              </Group>
              <Text size="xl" fw={700}>
                {(stats?.[key] ?? 0).toLocaleString()}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </PageShell>
  )
}
