import type { AuthResponse, LoginRequest, Organization, RegisterRequest } from '../types/auth.types'
import type {
  ChatbotInstance,
  ChatbotPublicConfig,
  CreateChatbotRequest,
  RotateKeysResponse,
  UpdateChatbotRequest,
} from '../types/chatbot.types'
import type {
  ChatHistoryResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '../types/chat.types'
import type {
  AdminStats,
  AnalyticsOverview,
  MessageDataPoint,
  SessionDataPoint,
} from '../types/analytics.types'
import type {
  CreateLLMApiKeyRequest,
  LLMApiKey,
  UpdateLLMApiKeyRequest,
} from '../types/llm.types'
import { API_BASE_PATH } from '../constants'

// ---------------------------------------------------------------------------
// Endpoint path constants
// ---------------------------------------------------------------------------
export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: `${API_BASE_PATH}/auth/register`,
  AUTH_LOGIN: `${API_BASE_PATH}/auth/login`,

  // Widget (Public API Key via X-API-Key header)
  WIDGET_CONFIG: `${API_BASE_PATH}/widget/config`,

  // Chatbots (JWT)
  CHATBOTS: `${API_BASE_PATH}/chatbots`,
  CHATBOT_BY_ID: (id: string) => `${API_BASE_PATH}/chatbots/${id}`,
  CHATBOT_ROTATE_KEYS: (id: string) => `${API_BASE_PATH}/chatbots/${id}/rotate-keys`,

  // Chat (Public API Key via X-API-Key header)
  CHAT_MESSAGE: `${API_BASE_PATH}/chat/message`,
  CHAT_HISTORY: (sessionId: string) => `${API_BASE_PATH}/chat/history/${sessionId}`,

  // LLM Keys (JWT)
  LLM_KEYS: `${API_BASE_PATH}/llm-keys`,
  LLM_KEY_BY_ID: (id: string) => `${API_BASE_PATH}/llm-keys/${id}`,

  // Analytics (JWT) — query params: from, to, period?
  ANALYTICS_OVERVIEW: (chatbotId: string) =>
    `${API_BASE_PATH}/analytics/${chatbotId}/overview`,
  ANALYTICS_MESSAGES: (chatbotId: string) =>
    `${API_BASE_PATH}/analytics/${chatbotId}/messages`,
  ANALYTICS_SESSIONS: (chatbotId: string) =>
    `${API_BASE_PATH}/analytics/${chatbotId}/sessions`,

  // Admin (JWT + MASTER_ADMIN role)
  ADMIN_ORGANIZATIONS: `${API_BASE_PATH}/admin/organizations`,
  ADMIN_STATS: `${API_BASE_PATH}/admin/stats`,
} as const

// ---------------------------------------------------------------------------
// Request / Response contracts per endpoint group
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace APIContracts {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Auth {
    export type RegisterBody = RegisterRequest
    export type RegisterResponse = AuthResponse
    export type LoginBody = LoginRequest
    export type LoginResponse = AuthResponse
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Widget {
    /** Authenticated with Public API Key (X-API-Key header) */
    export type GetConfigResponse = ChatbotPublicConfig
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Chatbots {
    export type ListResponse = ChatbotInstance[]
    export type CreateBody = CreateChatbotRequest
    export type CreateResponse = ChatbotInstance
    export type GetResponse = ChatbotInstance
    export type UpdateBody = UpdateChatbotRequest
    export type UpdateResponse = ChatbotInstance
    export type KeyRotationResponse = RotateKeysResponse
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Chat {
    /** Authenticated with Public API Key (X-API-Key header) */
    export type SendMessageBody = SendMessageRequest
    export type SendMessageRes = SendMessageResponse
    export type GetHistoryResponse = ChatHistoryResponse
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace LLMKeys {
    export type ListResponse = LLMApiKey[]
    export type CreateBody = CreateLLMApiKeyRequest
    export type CreateResponse = LLMApiKey
    export type UpdateBody = UpdateLLMApiKeyRequest
    export type UpdateResponse = LLMApiKey
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Analytics {
    export type OverviewResponse = AnalyticsOverview
    export type MessagesResponse = MessageDataPoint[]
    export type SessionsResponse = SessionDataPoint[]
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Admin {
    export type OrganizationsResponse = Organization[]
    export type StatsResponse = AdminStats
  }
}

// ---------------------------------------------------------------------------
// Standard API response envelopes
// ---------------------------------------------------------------------------
export interface APIResponse<T> {
  data: T
  success: true
}

export interface APIError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
}

export interface APIErrorResponse {
  error: APIError
  success: false
}
