'use client'

import { BarChart } from '@mantine/charts'
import { Card, Text, Stack } from '@mantine/core'
import { format } from 'date-fns'
import type { SessionDataPoint } from '@chatbot/shared'

interface SessionChartProps {
  data: SessionDataPoint[]
}

export function SessionChart({ data }: SessionChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    date: format(new Date(d.date), 'MMM d'),
  }))

  return (
    <Card>
      <Stack gap="xs" mb="md">
        <Text fw={600} size="sm">Sessions Over Time</Text>
        <Text size="xs" c="dimmed">Total and new user sessions</Text>
      </Stack>
      <BarChart
        h={260}
        data={formatted}
        dataKey="date"
        series={[
          { name: 'totalSessions', color: 'blue.6', label: 'Total' },
          { name: 'newSessions', color: 'blue.3', label: 'New' },
        ]}
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 36 }}
        barProps={{ radius: [4, 4, 0, 0] }}
      />
    </Card>
  )
}
