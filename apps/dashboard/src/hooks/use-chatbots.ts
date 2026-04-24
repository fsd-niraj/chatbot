'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notify } from '@/lib/notifications'
import type {
  ChatbotInstance,
  CreateChatbotRequest,
  UpdateChatbotRequest,
  RotateKeysResponse,
} from '@chatbot/shared'
import { ENDPOINTS } from '@chatbot/shared'
import api from '@/lib/api'

export function useListChatbots() {
  return useQuery<ChatbotInstance[]>({
    queryKey: ['chatbots'],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.CHATBOTS)
      return res.data
    },
  })
}

export function useGetChatbot(id: string) {
  return useQuery<ChatbotInstance>({
    queryKey: ['chatbots', id],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.CHATBOT_BY_ID(id))
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateChatbot() {
  const qc = useQueryClient()
  return useMutation<ChatbotInstance, Error, CreateChatbotRequest>({
    mutationFn: async (body) => {
      const res = await api.post(ENDPOINTS.CHATBOTS, body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chatbots'] })
      notify.success('Your new chatbot is ready to use.', { title: 'Chatbot created' })
    },
  })
}

export function useUpdateChatbot(id: string) {
  const qc = useQueryClient()
  return useMutation<ChatbotInstance, Error, UpdateChatbotRequest>({
    mutationFn: async (body) => {
      const res = await api.put(ENDPOINTS.CHATBOT_BY_ID(id), body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chatbots', id] })
      qc.invalidateQueries({ queryKey: ['chatbots'] })
      notify.success('Your changes have been saved.', { title: 'Chatbot updated' })
    },
  })
}

export function useDeleteChatbot() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(ENDPOINTS.CHATBOT_BY_ID(id))
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chatbots'] })
      notify.success('The chatbot has been permanently removed.', { title: 'Chatbot deleted' })
    },
  })
}

export function useRotateKeys(id: string) {
  const qc = useQueryClient()
  return useMutation<RotateKeysResponse, Error, void>({
    mutationFn: async () => {
      const res = await api.post(ENDPOINTS.CHATBOT_ROTATE_KEYS(id))
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chatbots', id] })
      notify.success('New keys have been generated. Update any integrations using the old keys.', { title: 'API keys rotated' })
    },
  })
}
