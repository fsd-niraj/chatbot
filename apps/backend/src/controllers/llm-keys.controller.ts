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
  LLMApiKey,
  CreateLLMApiKeyRequest,
  UpdateLLMApiKeyRequest,
  JWTPayload,
} from '@chatbot/shared'
import * as llmKeysService from '../services/llm-keys.service'

@Route('llm-keys')
@Tags('LLM Keys')
@Security('jwt')
export class LLMKeysController extends Controller {
  /** List all configured LLM API keys for the org (keys are masked). */
  @Get()
  async list(@Request() req: express.Request): Promise<LLMApiKey[]> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return llmKeysService.listKeys(user.orgId)
  }

  /**
   * Create or upsert an LLM API key for a provider.
   * Only one key per provider per org is allowed.
   */
  @Post()
  @SuccessResponse(201, 'Created')
  async create(
    @Request() req: express.Request,
    @Body() body: CreateLLMApiKeyRequest
  ): Promise<LLMApiKey> {
    const user = (req as express.Request & { user: JWTPayload }).user
    this.setStatus(201)
    return llmKeysService.createKey(user.orgId, body)
  }

  /** Update the API key or model config for a specific LLM key. */
  @Put('{id}')
  async update(
    @Path() id: string,
    @Request() req: express.Request,
    @Body() body: UpdateLLMApiKeyRequest
  ): Promise<LLMApiKey> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return llmKeysService.updateKey(user.orgId, id, body)
  }

  /** Delete an LLM API key. */
  @Delete('{id}')
  @SuccessResponse(204, 'No Content')
  async delete(@Path() id: string, @Request() req: express.Request): Promise<void> {
    const user = (req as express.Request & { user: JWTPayload }).user
    this.setStatus(204)
    return llmKeysService.deleteKey(user.orgId, id)
  }
}
