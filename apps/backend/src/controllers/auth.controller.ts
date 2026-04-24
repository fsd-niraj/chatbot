import { Controller, Post, Body, Route, Tags, SuccessResponse } from 'tsoa'
import type { RegisterRequest, LoginRequest, AuthResponse } from '@chatbot/shared'
import * as authService from '../services/auth.service'

@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
  /**
   * Register a new organization + admin user.
   * If the email matches MASTER_ADMIN_EMAIL env var, role is set to MASTER_ADMIN.
   */
  @Post('register')
  @SuccessResponse(201, 'Created')
  async register(@Body() body: RegisterRequest): Promise<AuthResponse> {
    this.setStatus(201)
    return authService.register(body)
  }

  /** Authenticate and receive a JWT. */
  @Post('login')
  async login(@Body() body: LoginRequest): Promise<AuthResponse> {
    return authService.login(body)
  }
}
