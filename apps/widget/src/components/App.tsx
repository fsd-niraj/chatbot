import { useState, useEffect, useRef } from 'react'
import type { ChatbotTheme } from '@chatbot/shared'
import { useConfig } from '../hooks/use-config'
import { useChat } from '../hooks/use-chat'
import { getSessionId } from '../lib/session'
import { Bubble } from './Bubble'
import { ChatWindow } from './ChatWindow'

interface AppProps {
  apiKey: string
}

function applyTheme(el: HTMLElement, theme: ChatbotTheme) {
  el.style.setProperty('--cb-primary', theme.primaryColor)
  el.style.setProperty('--cb-bg', theme.backgroundColor)
  el.style.setProperty('--cb-text', theme.textColor)
  el.style.setProperty('--cb-bubble', theme.bubbleColor)
}

export function App({ apiKey }: AppProps) {
  const [open, setOpen] = useState(false)
  const sessionId = useRef(getSessionId()).current
  const containerRef = useRef<HTMLDivElement>(null)
  const { config, loading: configLoading } = useConfig(apiKey)
  const { messages, loading: chatLoading, sendMessage, loadSessionHistory, error } = useChat(sessionId)
  const historyLoaded = useRef(false)

  useEffect(() => {
    if (config && containerRef.current) {
      applyTheme(containerRef.current, config.theme)
    }
  }, [config])

  const handleOpen = () => {
    setOpen(true)
    if (!historyLoaded.current) {
      historyLoaded.current = true
      loadSessionHistory(sessionId)
    }
  }

  if (configLoading || !config) return null

  const position = config.theme.position ?? 'bottom-right'
  const positionClass = position === 'bottom-left' ? 'left-6 bottom-6' : 'right-6 bottom-6'

  return (
    <div
      ref={containerRef}
      className={`fixed ${positionClass} flex flex-col items-end gap-3 z-[9999]`}
      style={{ fontFamily: config.theme.fontFamily ?? 'system-ui, sans-serif' }}
    >
      {open && (
        <ChatWindow
          config={config}
          messages={messages}
          loading={chatLoading}
          onSend={sendMessage}
          onClose={() => setOpen(false)}
          error={error}
        />
      )}
      <Bubble
        open={open}
        onClick={open ? () => setOpen(false) : handleOpen}
        bubbleColor={config.theme.bubbleColor}
      />
    </div>
  )
}
