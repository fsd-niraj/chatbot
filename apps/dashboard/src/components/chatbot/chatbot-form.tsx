'use client'

import {
  Button,
  Card,
  Grid,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Group,
  ColorInput,
  Title,
} from '@mantine/core'
import { useForm, isNotEmpty } from '@mantine/form'
import { ALL_MODELS, DEFAULT_CHATBOT_CONFIG, DEFAULT_THEME, LLMProvider } from '@chatbot/shared'
import type { CreateChatbotRequest } from '@chatbot/shared'

interface FormValues {
  name: string
  botName: string
  welcomeMessage: string
  provider: LLMProvider
  model: string
  systemPrompt: string
  temperature: number | string
  maxTokens: number | string
  primaryColor: string
  backgroundColor: string
  textColor: string
  bubbleColor: string
  position: 'bottom-right' | 'bottom-left'
}

interface ChatbotFormProps {
  defaultValues?: Partial<FormValues>
  onSubmit: (data: CreateChatbotRequest) => void
  isLoading?: boolean
  submitLabel?: string
}

export function ChatbotForm({ defaultValues, onSubmit, isLoading, submitLabel = 'Create' }: ChatbotFormProps) {
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      botName: DEFAULT_CHATBOT_CONFIG.botName,
      welcomeMessage: DEFAULT_CHATBOT_CONFIG.welcomeMessage,
      provider: LLMProvider.OPENAI,
      model: ALL_MODELS.openai[0],
      systemPrompt: '',
      temperature: 0.7,
      maxTokens: 1024,
      primaryColor: DEFAULT_THEME.primaryColor,
      backgroundColor: DEFAULT_THEME.backgroundColor,
      textColor: DEFAULT_THEME.textColor,
      bubbleColor: DEFAULT_THEME.bubbleColor,
      position: DEFAULT_THEME.position,
      ...defaultValues,
    },
    validate: {
      name: isNotEmpty('Name is required'),
      botName: isNotEmpty('Bot name is required'),
      welcomeMessage: isNotEmpty('Welcome message is required'),
      model: isNotEmpty('Model is required'),
    },
  })

  const models = ALL_MODELS[form.values.provider] as readonly string[]

  function handleProviderChange(v: string | null) {
    if (!v) return
    const provider = v as LLMProvider
    form.setFieldValue('provider', provider)
    form.setFieldValue('model', ALL_MODELS[provider][0])
  }

  function handleFormSubmit(values: FormValues) {
    const req: CreateChatbotRequest = {
      name: values.name,
      config: {
        botName: values.botName,
        welcomeMessage: values.welcomeMessage,
        theme: {
          primaryColor: values.primaryColor,
          backgroundColor: values.backgroundColor,
          textColor: values.textColor,
          bubbleColor: values.bubbleColor,
          position: values.position,
        },
        modelConfig: {
          provider: values.provider,
          model: values.model,
          systemPrompt: values.systemPrompt || undefined,
          temperature: typeof values.temperature === 'number' ? values.temperature : undefined,
          maxTokens: typeof values.maxTokens === 'number' ? values.maxTokens : undefined,
        },
      },
    }
    onSubmit(req)
  }

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <Stack gap="md">
        {/* Basic Info */}
        <Card>
          <Stack gap="md">
            <Title order={5} fw={600}>Basic Info</Title>
            <TextInput
              label="Instance Name"
              placeholder="My Support Bot"
              {...form.getInputProps('name')}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Bot Display Name"
                  placeholder="Assistant"
                  {...form.getInputProps('botName')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Widget Position"
                  data={[
                    { value: 'bottom-right', label: 'Bottom Right' },
                    { value: 'bottom-left', label: 'Bottom Left' },
                  ]}
                  {...form.getInputProps('position')}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              label="Welcome Message"
              {...form.getInputProps('welcomeMessage')}
            />
          </Stack>
        </Card>

        {/* Model Configuration */}
        <Card>
          <Stack gap="md">
            <Title order={5} fw={600}>Model Configuration</Title>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Provider"
                  data={Object.values(LLMProvider).map((p) => ({ value: p, label: p.toUpperCase() }))}
                  value={form.values.provider}
                  onChange={handleProviderChange}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Model"
                  data={models.map((m) => ({ value: m, label: m }))}
                  searchable
                  {...form.getInputProps('model')}
                />
              </Grid.Col>
            </Grid>
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
                  placeholder="0.7"
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
                  placeholder="1024"
                  min={1}
                  {...form.getInputProps('maxTokens')}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Theme */}
        <Card>
          <Stack gap="md">
            <Title order={5} fw={600}>Theme Colors</Title>
            <Grid>
              <Grid.Col span={6}>
                <ColorInput
                  label="Primary Color"
                  format="hex"
                  {...form.getInputProps('primaryColor')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <ColorInput
                  label="Background Color"
                  format="hex"
                  {...form.getInputProps('backgroundColor')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <ColorInput
                  label="Text Color"
                  format="hex"
                  {...form.getInputProps('textColor')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <ColorInput
                  label="Bubble Color"
                  format="hex"
                  {...form.getInputProps('bubbleColor')}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        <Button type="submit" loading={isLoading} size="md">
          {submitLabel}
        </Button>
      </Stack>
    </form>
  )
}
