import type { AuthResponse, LoginRequest, Organization, RegisterRequest } from '../types/auth.types';
import type { ChatbotInstance, ChatbotPublicConfig, CreateChatbotRequest, RotateKeysResponse, UpdateChatbotRequest } from '../types/chatbot.types';
import type { ChatHistoryResponse, SendMessageRequest, SendMessageResponse } from '../types/chat.types';
import type { AdminStats, AnalyticsOverview, MessageDataPoint, SessionDataPoint } from '../types/analytics.types';
import type { CreateLLMApiKeyRequest, LLMApiKey, UpdateLLMApiKeyRequest } from '../types/llm.types';
export declare const ENDPOINTS: {
    readonly AUTH_REGISTER: "/api/v1/auth/register";
    readonly AUTH_LOGIN: "/api/v1/auth/login";
    readonly WIDGET_CONFIG: "/api/v1/widget/config";
    readonly CHATBOTS: "/api/v1/chatbots";
    readonly CHATBOT_BY_ID: (id: string) => string;
    readonly CHATBOT_ROTATE_KEYS: (id: string) => string;
    readonly CHAT_MESSAGE: "/api/v1/chat/message";
    readonly CHAT_HISTORY: (sessionId: string) => string;
    readonly LLM_KEYS: "/api/v1/llm-keys";
    readonly LLM_KEY_BY_ID: (id: string) => string;
    readonly ANALYTICS_OVERVIEW: (chatbotId: string) => string;
    readonly ANALYTICS_MESSAGES: (chatbotId: string) => string;
    readonly ANALYTICS_SESSIONS: (chatbotId: string) => string;
    readonly ADMIN_ORGANIZATIONS: "/api/v1/admin/organizations";
    readonly ADMIN_STATS: "/api/v1/admin/stats";
};
export declare namespace APIContracts {
    namespace Auth {
        type RegisterBody = RegisterRequest;
        type RegisterResponse = AuthResponse;
        type LoginBody = LoginRequest;
        type LoginResponse = AuthResponse;
    }
    namespace Widget {
        /** Authenticated with Public API Key (X-API-Key header) */
        type GetConfigResponse = ChatbotPublicConfig;
    }
    namespace Chatbots {
        type ListResponse = ChatbotInstance[];
        type CreateBody = CreateChatbotRequest;
        type CreateResponse = ChatbotInstance;
        type GetResponse = ChatbotInstance;
        type UpdateBody = UpdateChatbotRequest;
        type UpdateResponse = ChatbotInstance;
        type KeyRotationResponse = RotateKeysResponse;
    }
    namespace Chat {
        /** Authenticated with Public API Key (X-API-Key header) */
        type SendMessageBody = SendMessageRequest;
        type SendMessageRes = SendMessageResponse;
        type GetHistoryResponse = ChatHistoryResponse;
    }
    namespace LLMKeys {
        type ListResponse = LLMApiKey[];
        type CreateBody = CreateLLMApiKeyRequest;
        type CreateResponse = LLMApiKey;
        type UpdateBody = UpdateLLMApiKeyRequest;
        type UpdateResponse = LLMApiKey;
    }
    namespace Analytics {
        type OverviewResponse = AnalyticsOverview;
        type MessagesResponse = MessageDataPoint[];
        type SessionsResponse = SessionDataPoint[];
    }
    namespace Admin {
        type OrganizationsResponse = Organization[];
        type StatsResponse = AdminStats;
    }
}
export interface APIResponse<T> {
    data: T;
    success: true;
}
export interface APIError {
    message: string;
    code: string;
    statusCode: number;
    details?: Record<string, unknown>;
}
export interface APIErrorResponse {
    error: APIError;
    success: false;
}
//# sourceMappingURL=contracts.d.ts.map