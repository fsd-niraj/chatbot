import { Controller, Get, Route, Tags, Security, Request } from 'tsoa'
import type express from 'express'
import type { ChatbotPublicConfig, ChatbotConfig } from '@chatbot/shared'
import { prisma } from '../lib/prisma'
import { publishEvent } from '../lib/event-publisher'

@Route('widget')
@Tags('Widget')
@Security('apiKey')
export class WidgetController extends Controller {
  /**
   * Returns the public config for a chatbot widget.
   * Authenticated via X-API-Key header (public key).
   */
  @Get('config')
  async getConfig(@Request() req: express.Request): Promise<ChatbotPublicConfig> {
    const instance = (req as express.Request & { user: { id: string; orgId: string; config: unknown } }).user
    const config = instance.config as ChatbotConfig

    // Look up provider + model from stored LLM key config for this org
    const llmKey = config?.modelConfig?.provider
      ? await prisma.llmApiKey.findUnique({
          where: {
            orgId_provider: {
              orgId: instance.orgId,
              provider: config.modelConfig.provider,
            },
          },
        })
      : null

    const modelConfig = llmKey
      ? { ...(llmKey.modelConfig as object), ...config?.modelConfig }
      : config?.modelConfig

    publishEvent({
      type: 'widget.loaded',
      chatbotId: instance.id,
      orgId: instance.orgId,
      referrer: req.headers.referer ?? null,
      userAgent: req.headers['user-agent'] ?? null,
    })

    return {
      botName: config?.botName ?? 'Assistant',
      welcomeMessage: config?.welcomeMessage ?? 'Hi! How can I help you today?',
      theme: config?.theme ?? {
        primaryColor: '#6366f1',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        bubbleColor: '#6366f1',
        position: 'bottom-right',
      },
      selectedModel: {
        provider: modelConfig?.provider ?? 'openai',
        model: modelConfig?.model ?? '',
      },
    }
  }
}
