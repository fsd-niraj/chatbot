'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Button,
  Badge,
  Card,
  Grid,
  Modal,
  Group,
  Stack,
  Text,
  Code,
  Skeleton,
  Switch,
  Divider,
  Title,
} from '@mantine/core'
import { IconRefresh, IconChartBar, IconSettings } from '@tabler/icons-react'
import { PageShell } from '@/components/layout/page-shell'
import { ApiKeyDisplay } from '@/components/chatbot/api-key-display'
import { useGetChatbot, useRotateKeys, useUpdateChatbot } from '@/hooks/use-chatbots'
import { formatDateTime } from '@/lib/utils'

function DataRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Group justify="space-between" py="sm" wrap="nowrap">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={500} ta="right">
        {value}
      </Text>
    </Group>
  )
}

export default function ChatbotDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: chatbot, isLoading } = useGetChatbot(id)
  const rotateMutation = useRotateKeys(id)
  const updateMutation = useUpdateChatbot(id)
  const [showRotateModal, setShowRotateModal] = useState(false)
  const [newPublicKey, setNewPublicKey] = useState<string | null>(null)

  async function handleRotate() {
    try {
      const res = await rotateMutation.mutateAsync()
      setNewPublicKey(res.publicKey)
      setShowRotateModal(true)
    } catch {
      // no-op
    }
  }

  async function handleToggleActive(checked: boolean) {
    await updateMutation.mutateAsync({ isActive: checked })
  }

  if (isLoading) {
    return (
      <Stack gap="lg">
        <Skeleton height={36} width={200} radius="md" />
        <Grid>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Skeleton height={280} radius="md" />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <Skeleton height={280} radius="md" />
          </Grid.Col>
        </Grid>
      </Stack>
    )
  }

  if (!chatbot) {
    return <Text size="sm" c="dimmed">Chatbot not found.</Text>
  }

  return (
    <PageShell
      title={chatbot.name}
      description={`Created ${formatDateTime(chatbot.createdAt)}`}
      action={
        <Group gap="xs">
          <Button
            component={Link}
            href={`/chatbots/${id}/analytics`}
            variant="default"
            size="sm"
            leftSection={<IconChartBar size={14} stroke={1.75} />}
          >
            Analytics
          </Button>
          <Button
            component={Link}
            href={`/chatbots/${id}/customize`}
            size="sm"
            leftSection={<IconSettings size={14} stroke={1.75} />}
          >
            Customize
          </Button>
        </Group>
      }
    >
      <Grid>
        {/* Configuration card */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card h="100%">
            <Group justify="space-between" mb="md">
              <Title order={5} fw={600}>Configuration</Title>
              <Badge size="sm" variant="dot" color={chatbot.isActive ? 'green' : 'gray'}>
                {chatbot.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </Group>

            <Stack gap={0}>
              <Group justify="space-between" py="sm">
                <Stack gap={2}>
                  <Text size="sm" fw={500}>Widget active</Text>
                  <Text size="xs" c="dimmed">Accepting incoming messages</Text>
                </Stack>
                <Switch
                  checked={chatbot.isActive}
                  onChange={(e) => handleToggleActive(e.currentTarget.checked)}
                  disabled={updateMutation.isPending}
                />
              </Group>
              <Divider />
              <DataRow label="Bot Name" value={chatbot.config.botName} />
              <Divider />
              <DataRow label="Provider" value={chatbot.config.modelConfig.provider.toUpperCase()} />
              <Divider />
              <DataRow
                label="Model"
                value={<Code style={{ fontSize: '0.7rem' }}>{chatbot.config.modelConfig.model}</Code>}
              />
              <Divider />
              <DataRow label="Updated" value={formatDateTime(chatbot.updatedAt)} />
            </Stack>
          </Card>
        </Grid.Col>

        {/* API Keys card */}
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Card h="100%">
            <Group justify="space-between" mb="md">
              <Title order={5} fw={600}>API Keys</Title>
              <Button
                variant="default"
                size="xs"
                leftSection={<IconRefresh size={13} stroke={1.75} style={rotateMutation.isPending ? { animation: 'spin 1s linear infinite' } : undefined} />}
                onClick={handleRotate}
                loading={rotateMutation.isPending}
              >
                Rotate
              </Button>
            </Group>

            <Stack gap="md">
              <ApiKeyDisplay label="Public Key" value={chatbot.publicKey} />
              <Text size="xs" c="dimmed">
                Private key shown once at creation. Use Rotate to generate a new key pair.
              </Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Modal
        opened={showRotateModal}
        onClose={() => setShowRotateModal(false)}
        title="Keys rotated"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Your new public key is below. The previous key is now invalid.
          </Text>
          {newPublicKey && <ApiKeyDisplay label="New Public Key" value={newPublicKey} />}
        </Stack>
      </Modal>
    </PageShell>
  )
}
