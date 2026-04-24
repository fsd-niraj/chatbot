import type { ChatbotPublicConfig } from '@chatbot/shared';
interface UseConfigResult {
    config: ChatbotPublicConfig | null;
    loading: boolean;
    error: string | null;
}
export declare function useConfig(apiKey: string): UseConfigResult;
export {};
//# sourceMappingURL=use-config.d.ts.map