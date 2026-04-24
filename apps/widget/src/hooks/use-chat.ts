import { useState, useCallback } from 'react'
import type { Message, SendMessageResponse, ChatHistoryResponse } from '@chatbot/shared'
import { ENDPOINTS } from '@chatbot/shared'
import { apiFetch } from '../lib/api'
import { saveHistory, loadHistory } from '../lib/storage'

interface UseChatResult {
  messages: Message[]
  loading: boolean
  sendMessage: (content: string) => Promise<void>
  loadSessionHistory: (sessionId: string) => Promise<void>
  error?: string
}

export function useChat(sessionId: string): UseChatResult {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadSessionHistory = useCallback(async (sid: string) => {
    const cached = loadHistory(sid)
    if (cached.length > 0) setMessages(cached)
    try {
      const data = await apiFetch<ChatHistoryResponse>(ENDPOINTS.CHAT_HISTORY(sid))
      if (data.messages.length > 0) {
        setMessages(data.messages)
        saveHistory(sid, data.messages)
      }
    } catch {
      // Use cached on error
      setError('Failed to load cache')
    }
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: Message = {
        id: crypto.randomUUID(),
        conversationId: '',
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => {
        const next = [...prev, userMsg]
        saveHistory(sessionId, next)
        return next
      })
      setLoading(true)
      try {
        const data = await apiFetch<SendMessageResponse>(ENDPOINTS.CHAT_MESSAGE, {
          method: 'POST',
          body: JSON.stringify({ message: content, sessionId }),
        })
        setMessages((prev) => {
          const next = [...prev, data.message]
          saveHistory(sessionId, next)
          return next
        })
      } catch {
        setError('Failed...')
      } finally {
        setLoading(false)
      }
    },
    [sessionId]
  )

  return { messages, loading, sendMessage, loadSessionHistory, error }
}
