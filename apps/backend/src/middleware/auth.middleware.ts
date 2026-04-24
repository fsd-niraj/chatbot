import express from 'express'
import { verifyToken } from '../lib/jwt'
import { prisma } from '../lib/prisma'

/**
 * TSOA authentication module.
 * Called by generated routes for @Security('jwt') and @Security('apiKey').
 * Sets request.user to the resolved auth entity so controllers can access it.
 */
export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  _scopes?: string[]
): Promise<unknown> {
  if (securityName === 'jwt') {
    const authHeader = request.headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw { statusCode: 401, message: 'Missing or invalid authorization header' }
    }
    const token = authHeader.slice(7)
    try {
      const payload = verifyToken(token)
      ;(request as express.Request & { user: unknown }).user = payload
      return payload
    } catch {
      throw { statusCode: 401, message: 'Invalid or expired token' }
    }
  }

  if (securityName === 'apiKey') {
    const apiKey = request.headers['x-api-key'] as string | undefined
    if (!apiKey) {
      throw { statusCode: 401, message: 'Missing X-API-Key header' }
    }
    const instance = await prisma.chatbotInstance.findUnique({
      where: { publicKey: apiKey },
    })
    if (!instance || !instance.isActive) {
      throw { statusCode: 401, message: 'Invalid or inactive API key' }
    }
    ;(request as express.Request & { user: unknown }).user = instance
    return instance
  }

  throw { statusCode: 401, message: 'Unknown security scheme' }
}
