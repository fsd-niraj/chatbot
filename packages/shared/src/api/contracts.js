import { API_BASE_PATH } from '../constants';
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
    CHATBOT_BY_ID: (id) => `${API_BASE_PATH}/chatbots/${id}`,
    CHATBOT_ROTATE_KEYS: (id) => `${API_BASE_PATH}/chatbots/${id}/rotate-keys`,
    // Chat (Public API Key via X-API-Key header)
    CHAT_MESSAGE: `${API_BASE_PATH}/chat/message`,
    CHAT_HISTORY: (sessionId) => `${API_BASE_PATH}/chat/history/${sessionId}`,
    // LLM Keys (JWT)
    LLM_KEYS: `${API_BASE_PATH}/llm-keys`,
    LLM_KEY_BY_ID: (id) => `${API_BASE_PATH}/llm-keys/${id}`,
    // Analytics (JWT) — query params: from, to, period?
    ANALYTICS_OVERVIEW: (chatbotId) => `${API_BASE_PATH}/analytics/${chatbotId}/overview`,
    ANALYTICS_MESSAGES: (chatbotId) => `${API_BASE_PATH}/analytics/${chatbotId}/messages`,
    ANALYTICS_SESSIONS: (chatbotId) => `${API_BASE_PATH}/analytics/${chatbotId}/sessions`,
    // Admin (JWT + MASTER_ADMIN role)
    ADMIN_ORGANIZATIONS: `${API_BASE_PATH}/admin/organizations`,
    ADMIN_STATS: `${API_BASE_PATH}/admin/stats`,
};
//# sourceMappingURL=contracts.js.map