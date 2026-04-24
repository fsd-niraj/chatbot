export type MessageRole = 'user' | 'assistant';
export interface Message {
    id: string;
    conversationId: string;
    role: MessageRole;
    content: string;
    createdAt: string;
}
export interface Conversation {
    id: string;
    chatbotInstanceId: string;
    browserSessionId: string;
    createdAt: string;
}
export interface SendMessageRequest {
    message: string;
    sessionId: string;
}
export interface SendMessageResponse {
    message: Message;
    conversationId: string;
}
export interface ChatHistoryResponse {
    conversation: Conversation;
    messages: Message[];
}
//# sourceMappingURL=chat.types.d.ts.map