'use client'

import {
  Button,
  Card,
  Grid,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  Textarea,
  Group,
  Badge,
  ActionIcon,
  Title,
} from '@mantine/core'
import { useForm, isNotEmpty } from '@mantine/form'
import { IconTrash } from '@tabler/icons-react'
import { ALL_MODELS, LLMProvider } from '@chatbot/shared'
import type { LLMApiKey, CreateLLMApiKeyRequest, UpdateLLMApiKeyRequest } from '@chatbot/shared'

interface FormValues {
  apiKey: string
  model: string
  systemPrompt: string
  temperature: number | string
  maxTokens: number | string
}

interface LLMKeyFormProps {
  provider: LLMProvider
  existingKey?: LLMApiKey
  onCreate: (data: CreateLLMApiKeyRequest) => void
  onUpdate: (id: string, data: UpdateLLMApiKeyRequest) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function LLMKeyForm({ provider, existingKey, onCreate, onUpdate, onDelete, isLoading }: LLMKeyFormProps) {
  const models = ALL_MODELS[provider] as readonly string[]
  const providerLabel = provider === LLMProvider.OPENAI ? 'OpenAI' : 'Anthropic'

  const form = useForm<FormValues>({
    initialValues: {
      apiKey: '',
      model: existingKey?.modelConfig.model ?? models[0],
      systemPrompt: existingKey?.modelConfig.systemPrompt ?? '',
      temperature: existingKey?.modelConfig.temperature ?? 0.7,
      maxTokens: existingKey?.modelConfig.maxTokens ?? 1024,
    },
    validate: {
      apiKey: (value) => {
        if (!existingKey && !value) return 'API key is required'
        return null
      },
      model: isNotEmpty('Model is required'),
    },
  })

  function handleSave(values: FormValues) {
    const modelConfig = {
      provider,
      model: values.model,
      systemPrompt: values.systemPrompt || undefined,
      temperature: typeof values.temperature === 'number' ? values.temperature : undefined,
      maxTokens: typeof values.maxTokens === 'number' ? values.maxTokens : undefined,
    }
    if (existingKey) {
      const update: UpdateLLMApiKeyRequest = { modelConfig }
      if (values.apiKey) update.apiKey = values.apiKey
      onUpdate(existingKey.id, update)
    } else {
      onCreate({ provider, apiKey: values.apiKey, modelConfig })
    }
  }

  return (
    <Card>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Title order={5} fw={600}>{providerLabel}</Title>
          {existingKey && (
            <Badge size="xs" variant="dot" color="green">Configured</Badge>
          )}
        </Group>
        {existingKey && (
          <ActionIcon
            variant="subtle"
            color="red"
            size="sm"
            onClick={() => onDelete(existingKey.id)}
            disabled={isLoading}
          >
            <IconTrash size={14} stroke={1.75} />
          </ActionIcon>
        )}
      </Group>

      <form onSubmit={form.onSubmit(handleSave)}>
        <Stack gap="md">
          <PasswordInput
            label={
              existingKey
                ? 'API Key — leave blank to keep existing'
                : 'API Key'
            }
            placeholder={existingKey ? '••••••••••••' : 'sk-...'}
            {...form.getInputProps('apiKey')}
          />

          <Select
            label="Default Model"
            data={models.map((m) => ({ value: m, label: m }))}
            searchable
            {...form.getInputProps('model')}
          />

          <Textarea
            label="System Prompt"
            placeholder="You are a helpful assistant..."
            rows={3}
            {...form.getInputProps('systemPrompt')}
          />

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Temperature"
                min={0}
                max={2}
                step={0.1}
                decimalScale={1}
                {...form.getInputProps('temperature')}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Max Tokens"
                min={1}
                {...form.getInputProps('maxTokens')}
              />
            </Grid.Col>
          </Grid>

          <Button type="submit" size="sm" loading={isLoading}>
            {existingKey ? 'Update' : 'Save'}
          </Button>
        </Stack>
      </form>
    </Card>
  )
}
