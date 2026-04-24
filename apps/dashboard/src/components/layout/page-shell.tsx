import * as React from 'react'
import { Stack, Group, Title, Text, Divider } from '@mantine/core'

interface PageShellProps {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}

export function PageShell({ title, description, action, children }: PageShellProps) {
  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Stack gap={4}>
          <Title order={2} fw={600} size="h3">
            {title}
          </Title>
          {description && (
            <Text size="sm" c="dimmed">
              {description}
            </Text>
          )}
        </Stack>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </Group>
      {/* <Divider /> */}
      <Stack gap="lg">
        {children}
      </Stack>
    </Stack>
  )
}
