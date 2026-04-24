import { BROWSER_SESSION_KEY } from '@chatbot/shared'

export function getSessionId(): string {
  try {
    const existing = localStorage.getItem(BROWSER_SESSION_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    localStorage.setItem(BROWSER_SESSION_KEY, id)
    return id
  } catch {
    // Fallback if localStorage is unavailable
    return crypto.randomUUID()
  }
}
