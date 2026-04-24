export declare enum LLMProvider {
    OPENAI = "openai",
    ANTHROPIC = "anthropic"
}
export interface ModelConfig {
    provider: LLMProvider;
    model: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
}
/** Stored in DB — actual key is never returned to the client */
export interface LLMApiKey {
    id: string;
    orgId: string;
    provider: LLMProvider;
    modelConfig: Partial<ModelConfig>;
    createdAt: string;
    updatedAt: string;
}
export interface CreateLLMApiKeyRequest {
    provider: LLMProvider;
    apiKey: string;
    modelConfig?: Partial<ModelConfig>;
}
export interface UpdateLLMApiKeyRequest {
    apiKey?: string;
    modelConfig?: Partial<ModelConfig>;
}
//# sourceMappingURL=llm.types.d.ts.map