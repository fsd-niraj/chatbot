import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { signToken } from '../lib/jwt'
import type { RegisterRequest, LoginRequest, AuthResponse } from '@chatbot/shared'
import { UserRole } from '@chatbot/shared'

export async function register(body: RegisterRequest): Promise<AuthResponse> {
  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) {
    throw { statusCode: 409, message: 'Email already in use' }
  }

  const passwordHash = await bcrypt.hash(body.password, 10)
  const role =
    body.email === process.env.MASTER_ADMIN_EMAIL ? UserRole.MASTER_ADMIN : UserRole.ORG_ADMIN

  const org = await prisma.organization.create({
    data: { name: body.orgName },
  })

  const user = await prisma.user.create({
    data: { orgId: org.id, email: body.email, passwordHash, role },
  })

  const token = signToken({
    userId: user.id,
    orgId: org.id,
    email: user.email,
    role: user.role as UserRole,
  })

  return {
    token,
    user: {
      id: user.id,
      orgId: user.orgId,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    organization: {
      id: org.id,
      name: org.name,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    },
  }
}

export async function login(body: LoginRequest): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
    include: { organization: true },
  })
  if (!user) {
    throw { statusCode: 401, message: 'Invalid email or password' }
  }

  const valid = await bcrypt.compare(body.password, user.passwordHash)
  if (!valid) {
    throw { statusCode: 401, message: 'Invalid email or password' }
  }

  const token = signToken({
    userId: user.id,
    orgId: user.orgId,
    email: user.email,
    role: user.role as UserRole,
  })

  return {
    token,
    user: {
      id: user.id,
      orgId: user.orgId,
      email: user.email,
      role: user.role as UserRole,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
    organization: {
      id: user.organization.id,
      name: user.organization.name,
      createdAt: user.organization.createdAt.toISOString(),
      updatedAt: user.organization.updatedAt.toISOString(),
    },
  }
}
