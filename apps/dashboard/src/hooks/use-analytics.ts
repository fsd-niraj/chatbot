'use client'

import { useQuery } from '@tanstack/react-query'
import type { AnalyticsOverview, MessageDataPoint, SessionDataPoint, AnalyticsQuery } from '@chatbot/shared'
import { ENDPOINTS } from '@chatbot/shared'
import api from '@/lib/api'

export function useAnalyticsOverview(chatbotId: string, query: AnalyticsQuery) {
  return useQuery<AnalyticsOverview>({
    queryKey: ['analytics', chatbotId, 'overview', query],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.ANALYTICS_OVERVIEW(chatbotId), { params: query })
      return res.data
    },
    enabled: !!chatbotId,
  })
}

export function useMessageAnalytics(chatbotId: string, query: AnalyticsQuery) {
  return useQuery<MessageDataPoint[]>({
    queryKey: ['analytics', chatbotId, 'messages', query],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.ANALYTICS_MESSAGES(chatbotId), { params: query })
      return res.data
    },
    enabled: !!chatbotId,
  })
}

export function useSessionAnalytics(chatbotId: string, query: AnalyticsQuery) {
  return useQuery<SessionDataPoint[]>({
    queryKey: ['analytics', chatbotId, 'sessions', query],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.ANALYTICS_SESSIONS(chatbotId), { params: query })
      return res.data
    },
    enabled: !!chatbotId,
  })
}
