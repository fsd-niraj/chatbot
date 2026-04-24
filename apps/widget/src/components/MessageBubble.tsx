import type { Message } from '@chatbot/shared'

interface Props {
  message: Message
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--cb-primary)] text-white rounded-br-sm'
            : 'bg-gray-100 text-[var(--cb-text)] rounded-bl-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
