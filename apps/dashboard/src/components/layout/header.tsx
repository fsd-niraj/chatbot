'use client'

import { useRouter, usePathname } from 'next/navigation'
import {
  Group,
  Burger,
  Breadcrumbs,
  Anchor,
  Avatar,
  Menu,
  ActionIcon,
  Text,
  useMantineColorScheme,
  useComputedColorScheme,
  rem,
} from '@mantine/core'
import {
  IconLogout,
  IconUser,
  IconSun,
  IconMoon,
} from '@tabler/icons-react'
import { useAuth } from '@/hooks/use-auth'

const BREADCRUMB_MAP: Record<string, string> = {
  chatbots: 'Chatbots',
  analytics: 'Analytics',
  settings: 'Settings',
  'llm-keys': 'LLM Keys',
  new: 'New',
  customize: 'Customize',
  admin: 'Admin',
  organizations: 'Organizations',
  stats: 'Stats',
}

interface HeaderProps {
  mobileNavOpened: boolean
  onToggleMobileNav: () => void
}

export function Header({ mobileNavOpened, onToggleMobileNav }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  const segments = pathname.split('/').filter(Boolean)
  const readable = segments
    .filter((s) => !s.match(/^[0-9a-f-]{20,}$/))
    .map((s) => BREADCRUMB_MAP[s] ?? s)

  const breadcrumbItems = readable.map((seg, i) => (
    <Text key={i} size="sm" fw={i === readable.length - 1 ? 600 : 400} c={i === readable.length - 1 ? undefined : 'dimmed'}>
      {seg}
    </Text>
  ))

  function handleLogout() {
    logout()
    router.push('/login')
  }

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '??'

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group gap="sm">
        <Burger
          opened={mobileNavOpened}
          onClick={onToggleMobileNav}
          hiddenFrom="sm"
          size="sm"
        />
        {breadcrumbItems.length > 0 && (
          <Breadcrumbs separator="/" separatorMargin={4} visibleFrom="sm">
            {breadcrumbItems}
          </Breadcrumbs>
        )}
      </Group>

      <Group gap="xs">
        <ActionIcon
          variant="subtle"
          color="gray"
          radius="md"
          size="lg"
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
          aria-label="Toggle color scheme"
        >
          {computedColorScheme === 'light'
            ? <IconMoon size={18} stroke={1.75} />
            : <IconSun size={18} stroke={1.75} />
          }
        </ActionIcon>

        <Menu shadow="md" width={220} position="bottom-end" offset={4}>
          <Menu.Target>
            <Avatar
              size={32}
              radius="md"
              variant="filled"
              style={{ cursor: 'pointer' }}
            >
              {initials}
            </Avatar>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>
              <Text size="xs" c="dimmed">{user?.role}</Text>
              <Text size="xs" fw={500} truncate style={{ maxWidth: rem(180) }}>{user?.email}</Text>
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconLogout size={14} stroke={1.75} />}
              onClick={handleLogout}
            >
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
