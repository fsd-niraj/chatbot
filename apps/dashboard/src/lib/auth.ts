import type { JWTPayload } from '@chatbot/shared'

const TOKEN_KEY = 'chatbot_token'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    // Check expiry
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null
    }
    return decoded as JWTPayload
  } catch {
    return null
  }
}
