'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell, Center, Loader } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuthStore } from '@/hooks/use-auth'
import { UserRole } from '@chatbot/shared'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()
  const [opened, { toggle }] = useDisclosure()

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.MASTER_ADMIN) {
      router.replace('/chatbots')
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="md" />
      </Center>
    )
  }

  if (user?.role !== UserRole.MASTER_ADMIN) return null

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
