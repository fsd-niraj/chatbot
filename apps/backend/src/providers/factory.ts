import type { PrismaClient } from '@prisma/client'
import { LLMProvider as LLMProviderEnum } from '@chatbot/shared'
import type { LLMProvider } from './base.provider'
import { OpenAIProvider } from './openai.provider'
import { AnthropicProvider } from './anthropic.provider'
import { decrypt } from '../lib/encryption'

export async function createProvider(
  orgId: string,
  provider: LLMProviderEnum,
  prisma: PrismaClient
): Promise<LLMProvider> {
  const llmKey = await prisma.llmApiKey.findUnique({
    where: { orgId_provider: { orgId, provider } },
  })

  if (!llmKey) {
    throw {
      statusCode: 400,
      message: `No ${provider} API key configured for this organization`,
    }
  }

  const apiKey = decrypt(llmKey.encryptedKey)

  switch (provider) {
    case LLMProviderEnum.OPENAI:
      return new OpenAIProvider(apiKey)
    case LLMProviderEnum.ANTHROPIC:
      return new AnthropicProvider(apiKey)
    default:
      throw { statusCode: 400, message: `Unsupported provider: ${provider}` }
  }
}
