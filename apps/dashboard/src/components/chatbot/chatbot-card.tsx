'use client'

import Link from 'next/link'
import {
  Card,
  Badge,
  Group,
  Text,
  Stack,
  ActionIcon,
  Menu,
  Box,
  Divider,
  Button,
} from '@mantine/core'
import {
  IconDotsVertical,
  IconTrash,
  IconSettings,
  IconChartBar,
} from '@tabler/icons-react'
import { formatRelative } from '@/lib/utils'
import type { ChatbotInstance } from '@chatbot/shared'

interface ChatbotCardProps {
  chatbot: ChatbotInstance
  onDelete: (id: string) => void
}

export function ChatbotCard({ chatbot, onDelete }: ChatbotCardProps) {
  return (
    <Card padding="md" style={{ display: 'flex', flexDirection: 'column' }}>
      <Stack gap="sm" style={{ flex: 1 }}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={2} style={{ overflow: 'hidden', flex: 1 }}>
            <Text fw={600} size="sm" truncate>
              {chatbot.name}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {chatbot.config.botName}
            </Text>
          </Stack>

          <Group gap={4} wrap="nowrap" style={{ flexShrink: 0 }}>
            <Badge
              size="xs"
              variant="dot"
              color={chatbot.isActive ? 'green' : 'gray'}
            >
              {chatbot.isActive ? 'Active' : 'Off'}
            </Badge>

            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size="sm" radius="md">
                  <IconDotsVertical size={14} stroke={1.75} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  href={`/chatbots/${chatbot.id}/customize`}
                  leftSection={<IconSettings size={14} stroke={1.75} />}
                >
                  Customize
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  href={`/chatbots/${chatbot.id}/analytics`}
                  leftSection={<IconChartBar size={14} stroke={1.75} />}
                >
                  Analytics
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} stroke={1.75} />}
                  onClick={() => onDelete(chatbot.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <Group gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {chatbot.config.modelConfig.provider}
          </Text>
          <Text size="xs" c="dimmed">·</Text>
          <Text size="xs" c="dimmed" truncate style={{ flex: 1 }}>
            {chatbot.config.modelConfig.model}
          </Text>
        </Group>
      </Stack>

      <Divider my="sm" />

      <Group justify="space-between" align="center">
        <Text size="xs" c="dimmed">
          {formatRelative(chatbot.updatedAt)}
        </Text>
        <Button
          component={Link}
          href={`/chatbots/${chatbot.id}`}
          variant="subtle"
          size="xs"
        >
          View
        </Button>
      </Group>
    </Card>
  )
}
