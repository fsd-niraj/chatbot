import { prisma } from '../lib/prisma'
import { createProvider } from '../providers/factory'
import type { SendMessageRequest, SendMessageResponse, ChatHistoryResponse } from '@chatbot/shared'
import { LLMProvider } from '@chatbot/shared'
import type { ChatbotConfig } from '@chatbot/shared'
import { publishEvent } from '../lib/event-publisher'

export async function sendMessage(
  chatbotInstanceId: string,
  orgId: string,
  body: SendMessageRequest
): Promise<SendMessageResponse> {
  const chatbot = await prisma.chatbotInstance.findUnique({ where: { id: chatbotInstanceId } })
  if (!chatbot) throw { statusCode: 404, message: 'Chatbot not found' }

  const config = chatbot.config as unknown as ChatbotConfig
  const modelConfig = config?.modelConfig
  if (!modelConfig?.provider) {
    throw { statusCode: 400, message: 'No model configured for this chatbot' }
  }

  // Find or create conversation for this session
  let conversation = await prisma.conversation.findFirst({
    where: { chatbotInstanceId, browserSessionId: body.sessionId },
  })
  const isNewConversation = !conversation
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { chatbotInstanceId, browserSessionId: body.sessionId },
    })
  }

  if (isNewConversation) {
    publishEvent({
      type: 'conversation.started',
      chatbotId: chatbotInstanceId,
      orgId,
      conversationId: conversation.id,
      sessionId: body.sessionId,
    })
  }

  // Save the user message
  await prisma.message.create({
    data: { conversationId: conversation.id, role: 'user', content: body.message },
  })

  publishEvent({
    type: 'message.sent',
    chatbotId: chatbotInstanceId,
    orgId,
    conversationId: conversation.id,
    sessionId: body.sessionId,
  })

  // Load recent history for context (last 20 messages)
  const history = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' },
    take: 20,
  })

  const messages = history.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  // Call the LLM provider
  const provider = await createProvider(orgId, modelConfig.provider as LLMProvider, prisma)
  const start = Date.now()
  let result: Awaited<ReturnType<typeof provider.complete>>
  try {
    result = await provider.complete(messages, modelConfig)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    publishEvent({
      type: 'error.llm',
      chatbotId: chatbotInstanceId,
      orgId,
      conversationId: conversation.id,
      provider: modelConfig.provider as string,
      errorCode: 'LLM_CALL_FAILED',
      errorMessage: errMsg,
    })
    throw err
  }
  const latencyMs = Date.now() - start

  publishEvent({
    type: 'message.responded',
    chatbotId: chatbotInstanceId,
    orgId,
    conversationId: conversation.id,
    latencyMs,
    tokensUsed: result.tokensUsed ?? 0,
    provider: modelConfig.provider as string,
    model: modelConfig.model ?? '',
  })

  // Save the assistant message
  const assistantMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: result.content,
      tokensUsed: result.tokensUsed,
      latencyMs,
    },
  })

  return {
    message: {
      id: assistantMessage.id,
      conversationId: conversation.id,
      role: 'assistant',
      content: assistantMessage.content,
      createdAt: assistantMessage.createdAt.toISOString(),
    },
    conversationId: conversation.id,
  }
}

export async function getChatHistory(
  chatbotInstanceId: string,
  sessionId: string
): Promise<ChatHistoryResponse> {
  const conversation = await prisma.conversation.findFirst({
    where: { chatbotInstanceId, browserSessionId: sessionId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })

  if (!conversation) throw { statusCode: 404, message: 'Conversation not found' }

  return {
    conversation: {
      id: conversation.id,
      chatbotInstanceId: conversation.chatbotInstanceId,
      browserSessionId: conversation.browserSessionId,
      createdAt: conversation.createdAt.toISOString(),
    },
    messages: conversation.messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  }
}
