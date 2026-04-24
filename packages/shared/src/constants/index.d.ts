export declare const API_VERSION = "v1";
export declare const API_BASE_PATH = "/api/v1";
export declare const OPENAI_MODELS: readonly ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];
export declare const ANTHROPIC_MODELS: readonly ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"];
export declare const ALL_MODELS: {
    readonly openai: readonly ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"];
    readonly anthropic: readonly ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"];
};
export declare const DEFAULT_MAX_TOKENS = 1024;
export declare const DEFAULT_TEMPERATURE = 0.7;
export declare const BROWSER_SESSION_KEY = "chatbot_session_id";
export declare const CHAT_HISTORY_KEY = "chatbot_history";
export declare const JWT_EXPIRY = "7d";
export declare const ANALYTICS_BATCH_INTERVAL_HOURS = 1;
//# sourceMappingURL=index.d.ts.map