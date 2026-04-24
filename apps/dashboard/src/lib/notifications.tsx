import React from 'react'
import { notifications } from '@mantine/notifications'
import { rem } from '@mantine/core'
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
} from '@tabler/icons-react'
import { green, red, yellow, blue } from '@/app/theme'

// ─── Config ──────────────────────────────────────────────────────────────────

const ICON_STYLE = { width: rem(20), height: rem(20) }

const COLORS = {
  success: green[9],  // #2b8a3e
  error:   red[9],    // #c92a2a
  warning: yellow[9], // #e67700
  info:    blue[5],   // #4c6ef5
} as const

const AUTO_CLOSE = {
  success: 4000,
  error:   5000,
  warning: 5000,
  info:    4000,
} as const

// ─── Options ─────────────────────────────────────────────────────────────────

interface NotifyOptions {
  title?: string
  autoClose?: number | false
}

// ─── Manager ─────────────────────────────────────────────────────────────────

class NotificationManager {
  success(message: string, options?: NotifyOptions) {
    notifications.show({
      title: options?.title ?? 'Success',
      message,
      color: COLORS.success,
      icon: React.createElement(IconCheck, { style: ICON_STYLE }),
      autoClose: options?.autoClose ?? AUTO_CLOSE.success,
    })
  }

  error(message: string, options?: NotifyOptions) {
    notifications.show({
      title: options?.title ?? 'Error',
      message,
      color: COLORS.error,
      icon: React.createElement(IconX, { style: ICON_STYLE }),
      autoClose: options?.autoClose ?? AUTO_CLOSE.error,
    })
  }

  warning(message: string, options?: NotifyOptions) {
    notifications.show({
      title: options?.title ?? 'Warning',
      message,
      color: COLORS.warning,
      icon: React.createElement(IconAlertTriangle, { style: ICON_STYLE }),
      autoClose: options?.autoClose ?? AUTO_CLOSE.warning,
    })
  }

  info(message: string, options?: NotifyOptions) {
    notifications.show({
      title: options?.title ?? 'Info',
      message,
      color: COLORS.info,
      icon: React.createElement(IconInfoCircle, { style: ICON_STYLE }),
      autoClose: options?.autoClose ?? AUTO_CLOSE.info,
    })
  }
}

export const notify = new NotificationManager()
