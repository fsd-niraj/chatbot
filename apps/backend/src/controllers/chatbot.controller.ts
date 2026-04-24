import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Path,
  Route,
  Tags,
  Security,
  Request,
  SuccessResponse,
} from 'tsoa'
import type express from 'express'
import type {
  ChatbotInstance,
  CreateChatbotRequest,
  UpdateChatbotRequest,
  RotateKeysResponse,
  JWTPayload,
} from '@chatbot/shared'
import * as chatbotService from '../services/chatbot.service'

@Route('chatbots')
@Tags('Chatbots')
@Security('jwt')
export class ChatbotController extends Controller {
  /** List all chatbot instances for the authenticated org. */
  @Get()
  async list(@Request() req: express.Request): Promise<ChatbotInstance[]> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return chatbotService.listChatbots(user.orgId)
  }

  /** Create a new chatbot instance. */
  @Post()
  @SuccessResponse(201, 'Created')
  async create(
    @Request() req: express.Request,
    @Body() body: CreateChatbotRequest
  ): Promise<ChatbotInstance> {
    const user = (req as express.Request & { user: JWTPayload }).user
    this.setStatus(201)
    return chatbotService.createChatbot(user.orgId, body)
  }

  /** Get a specific chatbot instance by ID. */
  @Get('{id}')
  async getById(@Path() id: string, @Request() req: express.Request): Promise<ChatbotInstance> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return chatbotService.getChatbot(user.orgId, id)
  }

  /** Update a chatbot instance. */
  @Put('{id}')
  async update(
    @Path() id: string,
    @Request() req: express.Request,
    @Body() body: UpdateChatbotRequest
  ): Promise<ChatbotInstance> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return chatbotService.updateChatbot(user.orgId, id, body)
  }

  /** Delete a chatbot instance. */
  @Delete('{id}')
  @SuccessResponse(204, 'No Content')
  async delete(@Path() id: string, @Request() req: express.Request): Promise<void> {
    const user = (req as express.Request & { user: JWTPayload }).user
    this.setStatus(204)
    return chatbotService.deleteChatbot(user.orgId, id)
  }

  /** Rotate public and private API keys for a chatbot instance. */
  @Post('{id}/rotate-keys')
  async rotateKeys(
    @Path() id: string,
    @Request() req: express.Request
  ): Promise<RotateKeysResponse> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return chatbotService.rotateKeys(user.orgId, id)
  }
}
