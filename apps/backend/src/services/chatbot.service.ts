import crypto from 'crypto'
import { prisma } from '../lib/prisma'
import type {
  ChatbotInstance,
  CreateChatbotRequest,
  UpdateChatbotRequest,
  RotateKeysResponse,
} from '@chatbot/shared'

function mapInstance(instance: {
  id: string
  orgId: string
  name: string
  publicKey: string
  config: unknown
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}): ChatbotInstance {
  return {
    id: instance.id,
    orgId: instance.orgId,
    name: instance.name,
    publicKey: instance.publicKey,
    config: instance.config as ChatbotInstance['config'],
    isActive: instance.isActive,
    createdAt: instance.createdAt.toISOString(),
    updatedAt: instance.updatedAt.toISOString(),
  }
}

function generateKeys() {
  return {
    publicKey: 'pub_' + crypto.randomBytes(24).toString('hex'),
    privateKey: 'priv_' + crypto.randomBytes(24).toString('hex'),
  }
}

export async function listChatbots(orgId: string): Promise<ChatbotInstance[]> {
  const instances = await prisma.chatbotInstance.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
  })
  return instances.map(mapInstance)
}

export async function createChatbot(
  orgId: string,
  body: CreateChatbotRequest
): Promise<ChatbotInstance> {
  const { publicKey, privateKey } = generateKeys()
  const instance = await prisma.chatbotInstance.create({
    data: {
      orgId,
      name: body.name,
      publicKey,
      privateKey,
      config: body.config as object,
    },
  })
  return mapInstance(instance)
}

export async function getChatbot(orgId: string, id: string): Promise<ChatbotInstance> {
  const instance = await prisma.chatbotInstance.findFirst({ where: { id, orgId } })
  if (!instance) throw { statusCode: 404, message: 'Chatbot not found' }
  return mapInstance(instance)
}

export async function updateChatbot(
  orgId: string,
  id: string,
  body: UpdateChatbotRequest
): Promise<ChatbotInstance> {
  const existing = await prisma.chatbotInstance.findFirst({ where: { id, orgId } })
  if (!existing) throw { statusCode: 404, message: 'Chatbot not found' }

  const updatedConfig = body.config
    ? { ...(existing.config as object), ...body.config }
    : existing.config

  const instance = await prisma.chatbotInstance.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      config: updatedConfig as object,
      ...(body.isActive !== undefined && { isActive: body.isActive }),
    },
  })
  return mapInstance(instance)
}

export async function deleteChatbot(orgId: string, id: string): Promise<void> {
  const existing = await prisma.chatbotInstance.findFirst({ where: { id, orgId } })
  if (!existing) throw { statusCode: 404, message: 'Chatbot not found' }
  await prisma.chatbotInstance.delete({ where: { id } })
}

export async function rotateKeys(orgId: string, id: string): Promise<RotateKeysResponse> {
  const existing = await prisma.chatbotInstance.findFirst({ where: { id, orgId } })
  if (!existing) throw { statusCode: 404, message: 'Chatbot not found' }

  const { publicKey, privateKey } = generateKeys()
  await prisma.chatbotInstance.update({ where: { id }, data: { publicKey, privateKey } })
  return { publicKey }
}
