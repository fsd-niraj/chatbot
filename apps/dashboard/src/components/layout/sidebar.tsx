'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  NavLink,
  Stack,
  Group,
  Avatar,
  Text,
  Box,
  ThemeIcon,
  Divider,
} from '@mantine/core'
import {
  IconRobot,
  IconChartBar,
  IconSettings,
  IconKey,
  IconBuilding,
  IconShieldCheck,
} from '@tabler/icons-react'
import { useAuth } from '@/hooks/use-auth'
import { UserRole } from '@chatbot/shared'

const navItems = [
  { href: '/chatbots', label: 'Chatbots', icon: IconRobot },
  { href: '/analytics', label: 'Analytics', icon: IconChartBar },
  { href: '/settings/llm-keys', label: 'LLM Keys', icon: IconKey },
  { href: '/settings', label: 'Settings', icon: IconSettings },
  { href: '/configure', label: 'Config', icon: IconSettings },
]

const adminItems = [
  { href: '/admin/organizations', label: 'Organizations', icon: IconBuilding },
  { href: '/admin/stats', label: 'Platform Stats', icon: IconShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, organization } = useAuth()
  const isMasterAdmin = user?.role === UserRole.MASTER_ADMIN

  function isActive(href: string) {
    if (href === '/settings') return pathname === '/settings'
    return pathname === href || pathname.startsWith(href + '/')
  }

  const orgName = organization?.name ?? 'My Organization'
  const initials = orgName.slice(0, 2).toUpperCase()

  return (
    <Stack h="100%" gap={0} style={{ overflow: 'hidden' }}>
      {/* Logo */}
      <Group px="md" h={56} gap="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)', flexShrink: 0 }}>
        <ThemeIcon size={30} radius="md" variant="light">
          <IconRobot size={16} stroke={1.75} />
        </ThemeIcon>
        <Text fw={600} size="sm">
          Chatbot
        </Text>
      </Group>

      {/* Nav links */}
      <Stack gap={2} p="sm" style={{ flex: 1, overflowY: 'auto' }}>
        {navItems.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            component={Link}
            href={href}
            label={label}
            leftSection={<Icon size={16} stroke={1.75} />}
            active={isActive(href)}
          />
        ))}

        {isMasterAdmin && (
          <>
            <Divider my="xs" label="Admin" labelPosition="left" />
            {adminItems.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                component={Link}
                href={href}
                label={label}
                leftSection={<Icon size={16} stroke={1.75} />}
                active={isActive(href)}
              />
            ))}
          </>
        )}
      </Stack>

      {/* User footer */}
      <Box
        p="sm"
        style={{ borderTop: '1px solid var(--mantine-color-default-border)', flexShrink: 0 }}
      >
        <Group gap="sm" wrap="nowrap">
          <Avatar size={32} radius="md" variant="filled">
            {initials}
          </Avatar>
          <Box style={{ overflow: 'hidden', flex: 1 }}>
            <Text size="xs" fw={600} truncate>
              {orgName}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {user?.email}
            </Text>
          </Box>
        </Group>
      </Box>
    </Stack>
  )
}
