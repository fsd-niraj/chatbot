'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell, Center, Loader } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useAuthStore } from '@/hooks/use-auth'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token, isLoading, initialize } = useAuthStore()
  const [opened, { toggle }] = useDisclosure()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/login')
    }
  }, [isLoading, token, router])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="md" />
      </Center>
    )
  }

  if (!token) return null

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="xl"
    >
      <AppShell.Header>
        <Header mobileNavOpened={opened} onToggleMobileNav={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-body)">
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
