import OpenAI from 'openai'
import type { ModelConfig } from '@chatbot/shared'
import { OPENAI_MODELS } from '@chatbot/shared'
import type { LLMProvider, LLMMessage, LLMResponse } from './base.provider'

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async complete(messages: LLMMessage[], config: ModelConfig): Promise<LLMResponse> {
    const openAIMessages: OpenAI.Chat.ChatCompletionMessageParam[] = []

    if (config.systemPrompt) {
      openAIMessages.push({ role: 'system', content: config.systemPrompt })
    }

    for (const m of messages) {
      openAIMessages.push({ role: m.role, content: m.content })
    }

    const response = await this.client.chat.completions.create({
      model: config.model || 'gpt-4o-mini',
      messages: openAIMessages,
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1024,
    })

    return {
      content: response.choices[0]?.message?.content ?? '',
      tokensUsed: response.usage?.total_tokens,
    }
  }

  async listModels(): Promise<string[]> {
    return [...OPENAI_MODELS]
  }
}
