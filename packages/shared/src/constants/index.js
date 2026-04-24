export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;
export const OPENAI_MODELS = [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo',
];
export const ANTHROPIC_MODELS = [
    'claude-opus-4-6',
    'claude-sonnet-4-6',
    'claude-haiku-4-5-20251001',
];
export const ALL_MODELS = {
    openai: OPENAI_MODELS,
    anthropic: ANTHROPIC_MODELS,
};
export const DEFAULT_MAX_TOKENS = 1024;
export const DEFAULT_TEMPERATURE = 0.7;
// Widget localStorage keys
export const BROWSER_SESSION_KEY = 'chatbot_session_id';
export const CHAT_HISTORY_KEY = 'chatbot_history';
export const JWT_EXPIRY = '7d';
export const ANALYTICS_BATCH_INTERVAL_HOURS = 1;
//# sourceMappingURL=index.js.map