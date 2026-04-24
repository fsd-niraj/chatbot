import jwt from 'jsonwebtoken'
import { JWTPayload, JWT_EXPIRY } from '@chatbot/shared'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret'

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload
}
