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
import { useForm, isEmail, isNotEmpty } from '@mantine/form'
import { IconRobot, IconAlertCircle } from '@tabler/icons-react'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api'
import { ENDPOINTS } from '@chatbot/shared'
import type { AuthResponse } from '@chatbot/shared'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: isEmail('Enter a valid email'),
      password: isNotEmpty('Password is required'),
    },
  })

  async function onSubmit(values: typeof form.values) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.post<AuthResponse>(ENDPOINTS.AUTH_LOGIN, values)
      login(res.data)
      router.push('/chatbots')
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ??
        'Login failed'
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
              Dashboard
            </Text>
            <Title order={1} c="white" fw={700} style={{ fontSize: rem(40), lineHeight: 1.15 }}>
              Build smarter<br />AI experiences.
            </Title>
          </Stack>
          <Stack gap="sm">
            {['Deploy AI chatbots in minutes', 'Real-time analytics', 'Enterprise-grade security'].map(
              (item) => (
                <Group key={item} gap="sm">
                  <Box
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.7)',
                      flexShrink: 0,
                    }}
                  />
                  <Text size="sm" c="rgba(255,255,255,0.8)">
                    {item}
                  </Text>
                </Group>
              )
            )}
          </Stack>
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
                Sign in
              </Title>
              <Text size="sm" c="dimmed">
                Welcome back — enter your credentials to continue.
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
                  label="Email address"
                  placeholder="you@company.com"
                  type="email"
                  autoComplete="email"
                  {...form.getInputProps('email')}
                />
                <PasswordInput
                  label="Password"
                  autoComplete="current-password"
                  {...form.getInputProps('password')}
                />
                <Button type="submit" fullWidth loading={isLoading} mt="xs">
                  Sign in
                </Button>
              </Stack>
            </form>

            <Text ta="center" size="sm" c="dimmed">
              No account?{' '}
              <Anchor component={Link} href="/register" size="sm" fw={500}>
                Create one
              </Anchor>
            </Text>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
