import { Controller, Get, Path, Query, Route, Tags, Security, Request } from 'tsoa'
import type express from 'express'
import type {
  AnalyticsOverview,
  MessageDataPoint,
  SessionDataPoint,
  JWTPayload,
} from '@chatbot/shared'
import * as analyticsService from '../services/analytics.service'

@Route('analytics')
@Tags('Analytics')
@Security('jwt')
export class AnalyticsController extends Controller {
  /** Aggregate overview stats for a chatbot over a time range. */
  @Get('{chatbotId}/overview')
  async getOverview(
    @Path() chatbotId: string,
    @Request() req: express.Request,
    @Query() from: string,
    @Query() to: string,
    @Query() period?: 'hour' | 'day'
  ): Promise<AnalyticsOverview> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return analyticsService.getOverview(user.orgId, chatbotId, { from, to, period })
  }

  /** Message volume time series for a chatbot. */
  @Get('{chatbotId}/messages')
  async getMessages(
    @Path() chatbotId: string,
    @Request() req: express.Request,
    @Query() from: string,
    @Query() to: string,
    @Query() period?: 'hour' | 'day'
  ): Promise<MessageDataPoint[]> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return analyticsService.getMessageAnalytics(user.orgId, chatbotId, { from, to, period })
  }

  /** Session time series for a chatbot. */
  @Get('{chatbotId}/sessions')
  async getSessions(
    @Path() chatbotId: string,
    @Request() req: express.Request,
    @Query() from: string,
    @Query() to: string,
    @Query() period?: 'hour' | 'day'
  ): Promise<SessionDataPoint[]> {
    const user = (req as express.Request & { user: JWTPayload }).user
    return analyticsService.getSessionAnalytics(user.orgId, chatbotId, { from, to, period })
  }
}
