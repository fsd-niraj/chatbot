import type { ModelConfig } from '@chatbot/shared'

export interface LLMMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface LLMResponse {
  content: string
  tokensUsed?: number
}

export interface LLMProvider {
  complete(messages: LLMMessage[], config: ModelConfig): Promise<LLMResponse>
  listModels(): Promise<string[]>
}
