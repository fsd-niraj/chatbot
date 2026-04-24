import Anthropic from '@anthropic-ai/sdk'
import type { ModelConfig } from '@chatbot/shared'
import { ANTHROPIC_MODELS } from '@chatbot/shared'
import type { LLMProvider, LLMMessage, LLMResponse } from './base.provider'

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  async complete(messages: LLMMessage[], config: ModelConfig): Promise<LLMResponse> {
    const response = await this.client.messages.create({
      model: config.model || 'claude-haiku-4-5-20251001',
      system: config.systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: config.temperature ?? 0.7,
      max_tokens: config.maxTokens ?? 1024,
    })

    const block = response.content[0]
    const content = block?.type === 'text' ? block.text : ''

    return {
      content,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    }
  }

  async listModels(): Promise<string[]> {
    return [...ANTHROPIC_MODELS]
  }
}
