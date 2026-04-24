import { prisma } from '../lib/prisma'
import type {
  LLMApiKey,
  CreateLLMApiKeyRequest,
  UpdateLLMApiKeyRequest,
} from '@chatbot/shared'
import { LLMProvider } from '@chatbot/shared'
import { encrypt } from '../lib/encryption'

function mapKey(key: {
  id: string
  orgId: string
  provider: string
  modelConfig: unknown
  createdAt: Date
  updatedAt: Date
}): LLMApiKey {
  return {
    id: key.id,
    orgId: key.orgId,
    provider: key.provider as LLMProvider,
    modelConfig: key.modelConfig as LLMApiKey['modelConfig'],
    createdAt: key.createdAt.toISOString(),
    updatedAt: key.updatedAt.toISOString(),
  }
}

export async function listKeys(orgId: string): Promise<LLMApiKey[]> {
  const keys = await prisma.llmApiKey.findMany({ where: { orgId } })
  return keys.map(mapKey)
}

export async function createKey(
  orgId: string,
  body: CreateLLMApiKeyRequest
): Promise<LLMApiKey> {
  const encryptedKey = encrypt(body.apiKey)
  const key = await prisma.llmApiKey.upsert({
    where: { orgId_provider: { orgId, provider: body.provider } },
    update: { encryptedKey, modelConfig: (body.modelConfig ?? {}) as object },
    create: {
      orgId,
      provider: body.provider,
      encryptedKey,
      modelConfig: (body.modelConfig ?? {}) as object,
    },
  })
  return mapKey(key)
}

export async function updateKey(
  orgId: string,
  id: string,
  body: UpdateLLMApiKeyRequest
): Promise<LLMApiKey> {
  const existing = await prisma.llmApiKey.findFirst({ where: { id, orgId } })
  if (!existing) throw { statusCode: 404, message: 'LLM key not found' }

  const updateData: { encryptedKey?: string; modelConfig?: object } = {}
  if (body.apiKey) updateData.encryptedKey = encrypt(body.apiKey)
  if (body.modelConfig) {
    updateData.modelConfig = { ...(existing.modelConfig as object), ...body.modelConfig }
  }

  const key = await prisma.llmApiKey.update({ where: { id }, data: updateData })
  return mapKey(key)
}

export async function deleteKey(orgId: string, id: string): Promise<void> {
  const existing = await prisma.llmApiKey.findFirst({ where: { id, orgId } })
  if (!existing) throw { statusCode: 404, message: 'LLM key not found' }
  await prisma.llmApiKey.delete({ where: { id } })
}
