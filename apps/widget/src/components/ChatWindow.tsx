import type { ChatbotPublicConfig } from '@chatbot/shared'
import { X } from 'lucide-react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import type { Message } from '@chatbot/shared'

interface Props {
  config: ChatbotPublicConfig
  messages: Message[]
  loading: boolean
  onSend: (message: string) => void
  onClose: () => void
  error?: string
}

export function ChatWindow({ config, messages, loading, onSend, onClose, error }: Props) {
  return (
    <div
      className="flex flex-col rounded-2xl shadow-2xl overflow-hidden"
      style={{
        width: '360px',
        height: '520px',
        backgroundColor: 'var(--cb-bg)',
        fontFamily: config.theme.fontFamily ?? 'inherit',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: 'var(--cb-primary)' }}
      >
        <div className="flex items-center gap-2">
          {config.theme.logoUrl && (
            <img
              src={config.theme.logoUrl}
              alt=""
              className="w-7 h-7 rounded-full object-cover"
            />
          )}
          <span className="text-white font-semibold text-sm">{config.botName}</span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="text-white/80 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <MessageList messages={messages} loading={loading} />

      {error && <div>{error}</div>}

      {/* Input */}
      <MessageInput onSend={onSend} disabled={loading} />
    </div>
  )
}
