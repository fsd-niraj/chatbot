import { useState, useEffect } from 'react'
import type { ChatbotPublicConfig } from '@chatbot/shared'
import { ENDPOINTS } from '@chatbot/shared'
import { apiFetch } from '../lib/api'

interface UseConfigResult {
  config: ChatbotPublicConfig | null
  loading: boolean
  error: string | null
}

export function useConfig(apiKey: string): UseConfigResult {
  const [config, setConfig] = useState<ChatbotPublicConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKey) return
    apiFetch<ChatbotPublicConfig>(ENDPOINTS.WIDGET_CONFIG)
      .then((data) => setConfig(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [apiKey])

  return { config, loading, error }
}
