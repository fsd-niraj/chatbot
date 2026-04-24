import type { Message } from '@chatbot/shared';
interface UseChatResult {
    messages: Message[];
    loading: boolean;
    sendMessage: (content: string) => Promise<void>;
    loadSessionHistory: (sessionId: string) => Promise<void>;
    error?: string;
}
export declare function useChat(sessionId: string): UseChatResult;
export {};
//# sourceMappingURL=use-chat.d.ts.map