import { Controller, Post, Get, Body, Path, Route, Tags, Security, Request } from 'tsoa'
import type express from 'express'
import type { SendMessageRequest, SendMessageResponse, ChatHistoryResponse } from '@chatbot/shared'
import * as chatService from '../services/chat.service'

@Route('chat')
@Tags('Chat')
@Security('apiKey')
export class ChatController extends Controller {
  /**
   * Send a message to the chatbot and receive an AI response.
   * Rate-limited to 60 requests/min per API key.
   */
  @Post('message')
  async sendMessage(
    @Request() req: express.Request,
    @Body() body: SendMessageRequest
  ): Promise<SendMessageResponse> {
    const instance = (req as express.Request & { user: { id: string; orgId: string } }).user
    return chatService.sendMessage(instance.id, instance.orgId, body)
  }

  /** Retrieve full chat history for a browser session. */
  @Get('history/{sessionId}')
  async getHistory(
    @Path() sessionId: string,
    @Request() req: express.Request
  ): Promise<ChatHistoryResponse> {
    const instance = (req as express.Request & { user: { id: string } }).user
    return chatService.getChatHistory(instance.id, sessionId)
  }
}
