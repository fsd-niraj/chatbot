'use client'

import { Box, Card, Title } from '@mantine/core'
import { PageShell } from '@/components/layout/page-shell'
import { OrgForm } from '@/components/settings/org-form'
import { useAuth } from '@/hooks/use-auth'

export default function SettingsPage() {
  const { organization } = useAuth()

  function handleSave(_name: string) {
    // Org name update stub — no backend endpoint in spec
  }

  return (
    <PageShell title="Settings" description="Manage your organization">
      <Box maw={480}>
        <Card>
          <Title order={5} fw={600} mb="md">Organization</Title>
          <OrgForm defaultName={organization?.name} onSubmit={handleSave} />
        </Card>
      </Box>
    </PageShell>
  )
}
