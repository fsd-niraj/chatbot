'use client'

import { LineChart } from '@mantine/charts'
import { Card, Text, Stack } from '@mantine/core'
import { format } from 'date-fns'
import type { MessageDataPoint } from '@chatbot/shared'

interface MessageChartProps {
  data: MessageDataPoint[]
}

export function MessageChart({ data }: MessageChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    date: format(new Date(d.date), 'MMM d'),
  }))

  return (
    <Card>
      <Stack gap="xs" mb="md">
        <Text fw={600} size="sm">Messages Over Time</Text>
        <Text size="xs" c="dimmed">Total, user, and assistant message volume</Text>
      </Stack>
      <LineChart
        h={260}
        data={formatted}
        dataKey="date"
        series={[
          { name: 'totalMessages', color: 'blue.6', label: 'Total' },
          { name: 'userMessages', color: 'blue.4', label: 'User' },
          { name: 'assistantMessages', color: 'teal.4', label: 'Assistant' },
        ]}
        curveType="monotone"
        withLegend
        legendProps={{ verticalAlign: 'bottom', height: 36 }}
        strokeDasharray="4 2"
        connectNulls={false}
      />
    </Card>
  )
}
