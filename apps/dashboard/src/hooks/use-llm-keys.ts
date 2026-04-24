'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { LLMApiKey, CreateLLMApiKeyRequest, UpdateLLMApiKeyRequest } from '@chatbot/shared'
import { ENDPOINTS } from '@chatbot/shared'
import api from '@/lib/api'

export function useListLLMKeys() {
  return useQuery<LLMApiKey[]>({
    queryKey: ['llm-keys'],
    queryFn: async () => {
      const res = await api.get(ENDPOINTS.LLM_KEYS)
      return res.data
    },
  })
}

export function useCreateLLMKey() {
  const qc = useQueryClient()
  return useMutation<LLMApiKey, Error, CreateLLMApiKeyRequest>({
    mutationFn: async (body) => {
      const res = await api.post(ENDPOINTS.LLM_KEYS, body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['llm-keys'] })
    },
  })
}

export function useUpdateLLMKey(id: string) {
  const qc = useQueryClient()
  return useMutation<LLMApiKey, Error, UpdateLLMApiKeyRequest>({
    mutationFn: async (body) => {
      const res = await api.put(ENDPOINTS.LLM_KEY_BY_ID(id), body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['llm-keys'] })
    },
  })
}

export function useDeleteLLMKey() {
  const qc = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await api.delete(ENDPOINTS.LLM_KEY_BY_ID(id))
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['llm-keys'] })
    },
  })
}
