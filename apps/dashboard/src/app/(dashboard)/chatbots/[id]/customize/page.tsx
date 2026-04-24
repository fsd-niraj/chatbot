'use client'

import { useParams, useRouter } from 'next/navigation'
import {
  Button,
  Card,
  Grid,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Skeleton,
  ColorInput,
  Title,
  Group,
} from '@mantine/core'
import { useEffect } from 'react'
import { useForm, isNotEmpty } from '@mantine/form'
import { PageShell } from '@/components/layout/page-shell'
import { WidgetPreview } from '@/components/chatbot/widget-preview'
import { useGetChatbot, useUpdateChatbot } from '@/hooks/use-chatbots'
import { ALL_MODELS, LLMProvider } from '@chatbot/shared'

interface FormValues {
  botName: string
  welcomeMessage: string
  primaryColor: string
  backgroundColor: string
  textColor: string
  bubbleColor: string
  position: 'bottom-right' | 'bottom-left'
  provider: LLMProvider
  model: string
  systemPrompt: string
  temperature: number | string
  maxTokens: number | string
}

export default function CustomizePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: chatbot, isLoading } = useGetChatbot(id)
  const updateMutation = useUpdateChatbot(id)

  const form = useForm<FormValues>({
    initialValues: {
      botName: chatbot?.config.botName ?? '',
      welcomeMessage: chatbot?.config.welcomeMessage ?? '',
      primaryColor: chatbot?.config.theme.primaryColor ?? '#7950f2',
      backgroundColor: chatbot?.config.theme.backgroundColor ?? '#ffffff',
      textColor: chatbot?.config.theme.textColor ?? '#000000',
      bubbleColor: chatbot?.config.theme.bubbleColor ?? '#7950f2',
      position: chatbot?.config.theme.position ?? 'bottom-right',
      provider: chatbot?.config.modelConfig.provider ?? LLMProvider.OPENAI,
      model: chatbot?.config.modelConfig.model ?? '',
      systemPrompt: chatbot?.config.modelConfig.systemPrompt ?? '',
      temperature: chatbot?.config.modelConfig.temperature ?? 0.7,
      maxTokens: chatbot?.config.modelConfig.maxTokens ?? 1024,
    },
    validate: {
      botName: isNotEmpty('Bot name is required'),
      welcomeMessage: isNotEmpty('Welcome message is required'),
      model: isNotEmpty('Model is required'),
    },
  })

  // Populate form once chatbot data arrives (initialValues runs before data is fetched)
  useEffect(() => {
    if (!chatbot) return
    form.setValues({
      botName: chatbot.config.botName,
      welcomeMessage: chatbot.config.welcomeMessage,
      primaryColor: chatbot.config.theme.primaryColor,
      backgroundColor: chatbot.config.theme.backgroundColor,
      textColor: chatbot.config.theme.textColor,
      bubbleColor: chatbot.config.theme.bubbleColor,
      position: chatbot.config.theme.position,
      provider: chatbot.config.modelConfig.provider,
      model: chatbot.config.modelConfig.model,
      systemPrompt: chatbot.config.modelConfig.systemPrompt ?? '',
      temperature: chatbot.config.modelConfig.temperature ?? 0.7,
      maxTokens: chatbot.config.modelConfig.maxTokens ?? 1024,
    })
    form.resetDirty()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbot?.id])

  const values = form.values
  const models = ALL_MODELS[values.provider] as readonly string[]

  const previewConfig = chatbot
    ? {
        ...chatbot.config,
        botName: values.botName || chatbot.config.botName,
        welcomeMessage: values.welcomeMessage || chatbot.config.welcomeMessage,
        theme: {
          ...chatbot.config.theme,
          primaryColor: values.primaryColor || chatbot.config.theme.primaryColor,
          backgroundColor: values.backgroundColor || chatbot.config.theme.backgroundColor,
          textColor: values.textColor || chatbot.config.theme.textColor,
          bubbleColor: values.bubbleColor || chatbot.config.theme.bubbleColor,
          position: values.position || chatbot.config.theme.position,
        },
      }
    : null

  async function handleSubmit(vals: FormValues) {
    await updateMutation.mutateAsync({
      config: {
        botName: vals.botName,
        welcomeMessage: vals.welcomeMessage,
        theme: {
          primaryColor: vals.primaryColor,
          backgroundColor: vals.backgroundColor,
          textColor: vals.textColor,
          bubbleColor: vals.bubbleColor,
          position: vals.position,
        },
        modelConfig: {
          provider: vals.provider,
          model: vals.model,
          systemPrompt: vals.systemPrompt || undefined,
          temperature: typeof vals.temperature === 'number' ? vals.temperature : undefined,
          maxTokens: typeof vals.maxTokens === 'number' ? vals.maxTokens : undefined,
        },
      },
    })
    router.push(`/chatbots/${id}`)
  }

  if (isLoading) {
    return (
      <Stack gap="lg">
        <Skeleton height={36} width={160} radius="md" />
        <Skeleton height={320} radius="md" />
      </Stack>
    )
  }

  return (
    <PageShell title="Customize" description={`Configure ${chatbot?.name}`}>
      <Group align="flex-start" gap="xl" wrap="nowrap">
        <form onSubmit={form.onSubmit(handleSubmit)} style={{ flex: 1, minWidth: 0 }}>
          <Stack gap="md">
            {/* Appearance */}
            <Card>
              <Title order={5} fw={600} mb="md">Appearance</Title>
              <Stack gap="md">
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput label="Bot Name" {...form.getInputProps('botName')} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Position"
                      data={[
                        { value: 'bottom-right', label: 'Bottom Right' },
                        { value: 'bottom-left', label: 'Bottom Left' },
                      ]}
                      {...form.getInputProps('position')}
                    />
                  </Grid.Col>
                </Grid>
                <Textarea label="Welcome Message" rows={2} {...form.getInputProps('welcomeMessage')} />
                <Grid>
                  <Grid.Col span={6}>
                    <ColorInput label="Primary Color" format="hex" {...form.getInputProps('primaryColor')} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <ColorInput label="Background Color" format="hex" {...form.getInputProps('backgroundColor')} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <ColorInput label="Text Color" format="hex" {...form.getInputProps('textColor')} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <ColorInput label="Bubble Color" format="hex" {...form.getInputProps('bubbleColor')} />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            {/* Model */}
            <Card>
              <Title order={5} fw={600} mb="md">Model</Title>
              <Stack gap="md">
                <Grid>
                  <Grid.Col span={6}>
                    <Select
                      label="Provider"
                      data={Object.values(LLMProvider).map((p) => ({ value: p, label: p.toUpperCase() }))}
                      value={values.provider}
                      onChange={(v) => {
                        if (!v) return
                        form.setFieldValue('provider', v as LLMProvider)
                        form.setFieldValue('model', ALL_MODELS[v as LLMProvider][0])
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Model"
                      data={models?.map((m) => ({ value: m, label: m })) ?? []}
                      searchable
                      {...form.getInputProps('model')}
                    />
                  </Grid.Col>
                </Grid>
                <Textarea label="System Prompt" rows={3} {...form.getInputProps('systemPrompt')} />
                <Grid>
                  <Grid.Col span={6}>
                    <NumberInput label="Temperature" min={0} max={2} step={0.1} decimalScale={1} {...form.getInputProps('temperature')} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput label="Max Tokens" min={1} {...form.getInputProps('maxTokens')} />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>

            <Button type="submit" loading={updateMutation.isPending} size="md">
              Save Changes
            </Button>
          </Stack>
        </form>

        {/* Preview */}
        <Stack visibleFrom="lg" gap="xs" style={{ flexShrink: 0 }}>
          <Text size="sm" fw={500} c="dimmed">Live Preview</Text>
          {previewConfig && (
            <WidgetPreview
              config={previewConfig}
              botName={values.botName}
              welcomeMessage={values.welcomeMessage}
            />
          )}
        </Stack>
      </Group>
    </PageShell>
  )
}
