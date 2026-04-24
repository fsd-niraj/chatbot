'use client'

import { useState } from 'react'
import {
  Group,
  Text,
  ActionIcon,
  CopyButton,
  Code,
  Tooltip,
  Paper,
  Stack,
} from '@mantine/core'
import { IconCopy, IconCheck, IconEye, IconEyeOff } from '@tabler/icons-react'

interface ApiKeyDisplayProps {
  label: string
  value: string
  masked?: boolean
}

export function ApiKeyDisplay({ label, value, masked = false }: ApiKeyDisplayProps) {
  const [visible, setVisible] = useState(!masked)

  const displayValue = visible ? value : value.slice(0, 8) + '•'.repeat(16)

  return (
    <Stack gap={6}>
      <Text size="sm" fw={500}>
        {label}
      </Text>
      <Paper
        withBorder
        p="xs"
        radius="md"
        style={{ background: 'var(--mantine-color-default-hover)' }}
      >
        <Group gap="xs" wrap="nowrap">
          <Code
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              background: 'transparent',
              fontSize: '0.75rem',
            }}
          >
            {displayValue}
          </Code>
          {masked && (
            <Tooltip label={visible ? 'Hide' : 'Show'} withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setVisible((v) => !v)}
              >
                {visible ? <IconEyeOff size={14} stroke={1.75} /> : <IconEye size={14} stroke={1.75} />}
              </ActionIcon>
            </Tooltip>
          )}
          <CopyButton value={value} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow>
                <ActionIcon
                  variant="subtle"
                  color={copied ? 'teal' : 'gray'}
                  size="sm"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={14} stroke={1.75} /> : <IconCopy size={14} stroke={1.75} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Paper>
    </Stack>
  )
}
