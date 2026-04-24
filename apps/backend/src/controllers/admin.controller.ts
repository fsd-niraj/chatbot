import { Controller, Get, Route, Tags, Security, Request } from 'tsoa'
import type express from 'express'
import type { Organization, AdminStats, JWTPayload } from '@chatbot/shared'
import { UserRole } from '@chatbot/shared'
import * as adminService from '../services/admin.service'

@Route('admin')
@Tags('Admin')
@Security('jwt')
export class AdminController extends Controller {
  /** List all organizations. Requires MASTER_ADMIN role. */
  @Get('organizations')
  async listOrganizations(@Request() req: express.Request): Promise<Organization[]> {
    const user = (req as express.Request & { user: JWTPayload }).user
    if (user.role !== UserRole.MASTER_ADMIN) {
      throw { statusCode: 403, message: 'Access denied: MASTER_ADMIN role required' }
    }
    return adminService.listOrganizations()
  }

  /** Global platform stats. Requires MASTER_ADMIN role. */
  @Get('stats')
  async getStats(@Request() req: express.Request): Promise<AdminStats> {
    const user = (req as express.Request & { user: JWTPayload }).user
    if (user.role !== UserRole.MASTER_ADMIN) {
      throw { statusCode: 403, message: 'Access denied: MASTER_ADMIN role required' }
    }
    return adminService.getStats()
  }
}
