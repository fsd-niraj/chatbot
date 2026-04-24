'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Card,
  Skeleton,
  Group,
  Text,
  Stack,
  Code,
  Divider,
  Title,
} from '@mantine/core'
import { PageShell } from '@/components/layout/page-shell'
import api from '@/lib/api'
import { ENDPOINTS } from '@chatbot/shared'
import type { Organization } from '@chatbot/shared'
import { formatDate } from '@/lib/utils'

function useOrganizations() {
  return useQuery<Organization[]>({
    queryKey: ['admin', 'organizations'],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.ADMIN_ORGANIZATIONS)
      return res.data
    },
  })
}

export default function AdminOrganizationsPage() {
  const { data: orgs, isLoading } = useOrganizations()

  return (
    <PageShell title="Organizations" description="All registered organizations">
      {isLoading ? (
        <Skeleton height={280} radius="md" />
      ) : (
        <Card>
          <Title order={5} fw={600} mb="md">
            {orgs?.length ?? 0} Organizations
          </Title>
          <Stack gap={0}>
            {orgs?.map((org, i) => (
              <div key={org.id}>
                {i > 0 && <Divider />}
                <Group justify="space-between" py="sm">
                  <Stack gap={2}>
                    <Text size="sm" fw={500}>{org.name}</Text>
                    <Code style={{ fontSize: '0.7rem' }}>{org.id}</Code>
                  </Stack>
                  <Text size="xs" c="dimmed">{formatDate(org.createdAt)}</Text>
                </Group>
              </div>
            ))}
          </Stack>
        </Card>
      )}
    </PageShell>
  )
}
