'use client'

import { SimpleGrid } from '@mantine/core'
import { modals } from '@mantine/modals'
import { Text } from '@mantine/core'
import { PageShell } from '@/components/layout/page-shell'
import { LLMKeyForm } from '@/components/settings/llm-key-form'
import { useListLLMKeys, useCreateLLMKey, useUpdateLLMKey, useDeleteLLMKey } from '@/hooks/use-llm-keys'
import { LLMProvider } from '@chatbot/shared'
import type { CreateLLMApiKeyRequest, UpdateLLMApiKeyRequest } from '@chatbot/shared'

function ProviderSection({ provider }: { provider: LLMProvider }) {
  const { data: keys } = useListLLMKeys()
  const createKey = useCreateLLMKey()
  const deleteKey = useDeleteLLMKey()

  const existingKey = keys?.find((k) => k.provider === provider)
  const updateKey = useUpdateLLMKey(existingKey?.id ?? '')

  async function handleCreate(data: CreateLLMApiKeyRequest) {
    await createKey.mutateAsync(data)
  }

  async function handleUpdate(id: string, data: UpdateLLMApiKeyRequest) {
    await updateKey.mutateAsync(data)
  }

  function handleDelete(id: string) {
    modals.openConfirmModal({
      title: 'Remove API key',
      children: <Text size="sm">Are you sure you want to remove this API key?</Text>,
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteKey.mutate(id),
    })
  }

  const isLoading = createKey.isPending || updateKey.isPending || deleteKey.isPending

  return (
    <LLMKeyForm
      provider={provider}
      existingKey={existingKey}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      isLoading={isLoading}
    />
  )
}

export default function LLMKeysPage() {
  return (
    <PageShell title="LLM API Keys" description="Configure your AI provider keys and model defaults">
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <ProviderSection provider={LLMProvider.OPENAI} />
        <ProviderSection provider={LLMProvider.ANTHROPIC} />
      </SimpleGrid>
    </PageShell>
  )
}
