import type { LLMProvider, ModelConfig } from './llm.types';
export interface ChatbotTheme {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    bubbleColor: string;
    position: 'bottom-right' | 'bottom-left';
    fontFamily?: string;
    logoUrl?: string;
}
export declare const DEFAULT_THEME: ChatbotTheme;
export interface ChatbotConfig {
    theme: ChatbotTheme;
    welcomeMessage: string;
    botName: string;
    modelConfig: ModelConfig;
}
export declare const DEFAULT_CHATBOT_CONFIG: {
    readonly welcomeMessage: "Hi! How can I help you today?";
    readonly botName: "Assistant";
    readonly theme: ChatbotTheme;
};
export interface ChatbotInstance {
    id: string;
    orgId: string;
    name: string;
    publicKey: string;
    config: ChatbotConfig;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
/** Returned to widget on init — no sensitive data */
export interface ChatbotPublicConfig {
    botName: string;
    welcomeMessage: string;
    theme: ChatbotTheme;
    selectedModel: {
        provider: LLMProvider;
        model: string;
    };
}
export interface CreateChatbotRequest {
    name: string;
    config: ChatbotConfig;
}
export interface UpdateChatbotRequest {
    name?: string;
    config?: Partial<ChatbotConfig>;
    isActive?: boolean;
}
export interface RotateKeysResponse {
    publicKey: string;
}
//# sourceMappingURL=chatbot.types.d.ts.map