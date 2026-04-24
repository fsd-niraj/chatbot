import type { Message } from '@chatbot/shared'
import { CHAT_HISTORY_KEY } from '@chatbot/shared'

export function saveHistory(sessionId: string, messages: Message[]): void {
  try {
    const key = `${CHAT_HISTORY_KEY}_${sessionId}`
    localStorage.setItem(key, JSON.stringify(messages))
  } catch {
    // Ignore storage errors
  }
}

export function loadHistory(sessionId: string): Message[] {
  try {
    const key = `${CHAT_HISTORY_KEY}_${sessionId}`
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw) as Message[]
  } catch {
    return []
  }
}
