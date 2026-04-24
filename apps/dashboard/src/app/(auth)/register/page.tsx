'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Box,
  Button,
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Stack,
  Alert,
  ThemeIcon,
  Group,
  Anchor,
  rem,
} from '@mantine/core'
import { useForm, isEmail, isNotEmpty, hasLength } from '@mantine/form'
import { IconRobot, IconAlertCircle, IconCheck } from '@tabler/icons-react'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api'
import { ENDPOINTS } from '@chatbot/shared'
import type { AuthResponse } from '@chatbot/shared'

const FEATURES = [
  'Up to 3 chatbot instances',
  'Bring your own API keys',
  'Full analytics dashboard',
  'Unlimited messages',
]

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    initialValues: { orgName: '', email: '', password: '' },
    validate: {
      orgName: isNotEmpty('Organization name is required'),
      email: isEmail('Enter a valid email'),
      password: hasLength({ min: 8 }, 'Password must be at least 8 characters'),
    },
  })

  async function onSubmit(values: typeof form.values) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.post<AuthResponse>(ENDPOINTS.AUTH_REGISTER, values)
      login(res.data)
      router.push('/chatbots')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ??
        'Registration failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <Box
        visibleFrom="lg"
        style={{
          width: '42%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: rem(48),
          background: 'var(--mantine-color-dark-8)',
        }}
      >
        <Group gap="sm">
          <ThemeIcon size={32} radius="md" color="white" variant="transparent">
            <IconRobot size={20} stroke={1.75} />
          </ThemeIcon>
          <Text fw={600} c="white" size="sm">
            Cobot
          </Text>
        </Group>

        <Stack gap="xl">
          <Stack gap="xs">
            <Text size="xs" c="rgba(255,255,255,0.6)" tt="uppercase" fw={600} style={{ letterSpacing: '0.06em' }}>
              Get Started
            </Text>
            <Title order={1} c="white" fw={700} style={{ fontSize: rem(40), lineHeight: 1.15 }}>
              Get started<br />in seconds.
            </Title>
          </Stack>

          <Paper p="lg" radius="md" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Text size="sm" fw={600} c="white" mb="sm">
              Free tier includes
            </Text>
            <Stack gap="xs">
              {FEATURES.map((item) => (
                <Group key={item} gap="sm">
                  <ThemeIcon size={18} radius="xl" color="white" variant="transparent">
                    <IconCheck size={12} stroke={2.5} />
                  </ThemeIcon>
                  <Text size="sm" c="rgba(255,255,255,0.85)">
                    {item}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Stack>

        <Text size="xs" c="rgba(255,255,255,0.5)">
          © 2026 Cobot
        </Text>
      </Box>

      {/* Right form panel */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: `${rem(48)} ${rem(24)}`,
        }}
      >
        <Paper w="100%" maw={380} p="xl" withBorder shadow="sm">
          <Stack gap="lg">
            <Stack gap={4}>
              <Title order={3} fw={600}>
                Create account
              </Title>
              <Text size="sm" c="dimmed">
                Set up your organization to get started.
              </Text>
            </Stack>

            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                {error}
              </Alert>
            )}

            <form onSubmit={form.onSubmit(onSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Organization name"
                  placeholder="Acme Corp"
                  {...form.getInputProps('orgName')}
                />
                <TextInput
                  label="Work email"
                  placeholder="you@company.com"
                  type="email"
                  autoComplete="email"
                  {...form.getInputProps('email')}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  {...form.getInputProps('password')}
                />
                <Button type="submit" fullWidth loading={isLoading} mt="xs">
                  Create account
                </Button>
              </Stack>
            </form>

            <Text ta="center" size="sm" c="dimmed">
              Already have an account?{' '}
              <Anchor component={Link} href="/login" size="sm" fw={500}>
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
