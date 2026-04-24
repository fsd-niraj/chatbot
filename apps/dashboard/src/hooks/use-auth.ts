'use client'

import { create } from 'zustand'
import type { User, Organization, AuthResponse } from '@chatbot/shared'
import { getToken, setToken, clearToken, decodeToken } from '@/lib/auth'

interface AuthStore {
  token: string | null
  user: User | null
  organization: Organization | null
  isLoading: boolean
  login: (response: AuthResponse) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  organization: null,
  isLoading: true,

  login(response) {
    setToken(response.token)
    set({ token: response.token, user: response.user, organization: response.organization })
  },

  logout() {
    clearToken()
    set({ token: null, user: null, organization: null })
  },

  initialize() {
    const token = getToken()
    if (!token) {
      set({ isLoading: false })
      return
    }
    const payload = decodeToken(token)
    if (!payload) {
      clearToken()
      set({ isLoading: false })
      return
    }
    // Re-hydrate minimal user info from token; full user/org fetched lazily
    set({
      token,
      user: {
        id: payload.userId,
        orgId: payload.orgId,
        email: payload.email,
        role: payload.role,
        createdAt: '',
        updatedAt: '',
      },
      isLoading: false,
    })
  },
}))

export function useAuth() {
  return useAuthStore()
}
