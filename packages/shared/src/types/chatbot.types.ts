import type { LLMProvider, ModelConfig } from './llm.types'

export interface ChatbotTheme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  bubbleColor: string
  position: 'bottom-right' | 'bottom-left'
  fontFamily?: string
  logoUrl?: string
}

export const DEFAULT_THEME: ChatbotTheme = {
  primaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  textColor: '#111827',
  bubbleColor: '#6366f1',
  position: 'bottom-right',
}

export interface ChatbotConfig {
  theme: ChatbotTheme
  welcomeMessage: string
  botName: string
  modelConfig: ModelConfig
}

export const DEFAULT_CHATBOT_CONFIG = {
  welcomeMessage: 'Hi! How can I help you today?',
  botName: 'Assistant',
  theme: DEFAULT_THEME,
} as const

export interface ChatbotInstance {
  id: string
  orgId: string
  name: string
  publicKey: string
  config: ChatbotConfig
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Returned to widget on init — no sensitive data */
export interface ChatbotPublicConfig {
  botName: string
  welcomeMessage: string
  theme: ChatbotTheme
  selectedModel: { provider: LLMProvider; model: string }
}

export interface CreateChatbotRequest {
  name: string
  config: ChatbotConfig
}

export interface UpdateChatbotRequest {
  name?: string
  config?: Partial<ChatbotConfig>
  isActive?: boolean
}

export interface RotateKeysResponse {
  publicKey: string
}
