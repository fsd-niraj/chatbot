'use client'

import { IconMessageCircle, IconX, IconSend } from '@tabler/icons-react'
import type { ChatbotConfig } from '@chatbot/shared'

interface WidgetPreviewProps {
  config: ChatbotConfig
  botName?: string
  welcomeMessage?: string
  websiteUrl?: string
}

export function WidgetPreview({ config, botName, welcomeMessage, websiteUrl }: WidgetPreviewProps) {
  const { theme } = config
  const name = botName || config.botName || 'Assistant'
  const welcome = welcomeMessage || config.welcomeMessage || 'Hi! How can I help?'

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: 520, width: 340, overflow: 'hidden', borderRadius: 16, border: '1px solid #333', backgroundColor: '#F5F5F5' }}>
      {/* Mock browser bar */}
      <div style={{ display: 'flex', height: 32, alignItems: 'center', gap: 8, borderBottom: '1px solid #E0E0E0', backgroundColor: '#FFFFFF', padding: '0 12px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ height: 8, width: 8, borderRadius: '50%', backgroundColor: '#D71921' }} />
          <div style={{ height: 8, width: 8, borderRadius: '50%', backgroundColor: '#D4A843' }} />
          <div style={{ height: 8, width: 8, borderRadius: '50%', backgroundColor: '#4A9E5C' }} />
        </div>
        <div style={{ flex: 1, margin: '0 8px', borderRadius: 4, border: '1px solid #E0E0E0', backgroundColor: '#F5F5F5', padding: '2px 8px', fontFamily: 'monospace', fontSize: 10, color: '#999' }}>
          {websiteUrl ?? 'your@website.com'}
        </div>
      </div>

      {/* Page content mock */}
      <div style={{ flex: 1, padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ height: 10, width: '66%', borderRadius: 2, backgroundColor: '#E0E0E0' }} />
          <div style={{ height: 8, width: '100%', borderRadius: 2, backgroundColor: '#E8E8E8' }} />
          <div style={{ height: 8, width: '80%', borderRadius: 2, backgroundColor: '#E8E8E8' }} />
          <div style={{ height: 8, width: '100%', borderRadius: 2, backgroundColor: '#E8E8E8', marginTop: 16 }} />
          <div style={{ height: 8, width: '75%', borderRadius: 2, backgroundColor: '#E8E8E8' }} />
        </div>
      </div>

      {/* Chat window */}
      <div style={{ position: 'absolute', bottom: 80, right: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 16, border: '1px solid #E0E0E0', width: 280, backgroundColor: theme.backgroundColor }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', backgroundColor: theme.primaryColor }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'white', margin: 0 }}>{name}</p>
          <IconX size={14} style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }} stroke={1.75} />
        </div>

        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12, minHeight: 160 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ maxWidth: '78%', borderRadius: '16px 16px 16px 4px', padding: '8px 12px', fontSize: 11, lineHeight: 1.5, backgroundColor: theme.primaryColor + '18', color: theme.textColor }}>
              {welcome}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ maxWidth: '78%', borderRadius: '16px 16px 4px 16px', padding: '8px 12px', fontSize: 11, lineHeight: 1.5, color: 'white', backgroundColor: theme.primaryColor }}>
              Hello! Can you help me?
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ maxWidth: '78%', borderRadius: '16px 16px 16px 4px', padding: '8px 12px', fontSize: 11, lineHeight: 1.5, backgroundColor: theme.primaryColor + '18', color: theme.textColor }}>
              Of course! What do you need?
            </div>
          </div>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid #E0E0E0', padding: '8px 12px' }}>
          <input
            style={{ flex: 1, background: 'transparent', fontSize: 11, outline: 'none', color: theme.textColor, border: 'none' }}
            placeholder="Type a message…"
            readOnly
          />
          <button style={{ display: 'flex', height: 24, width: 24, flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: theme.primaryColor, border: 'none', cursor: 'pointer' }}>
            <IconSend size={12} color="white" stroke={1.75} />
          </button>
        </div>
      </div>

      {/* Bubble */}
      <button style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: theme.bubbleColor, border: 'none', cursor: 'pointer' }}>
        <IconMessageCircle size={20} color="white" stroke={1.75} />
      </button>
    </div>
  )
}
