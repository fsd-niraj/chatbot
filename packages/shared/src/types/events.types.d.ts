export type EventType = 'message.sent' | 'message.responded' | 'conversation.started' | 'conversation.ended' | 'widget.loaded' | 'error.llm';
interface BaseEvent {
    eventId: string;
    chatbotId: string;
    orgId: string;
    occurredAt: string;
}
export interface MessageSentEvent extends BaseEvent {
    type: 'message.sent';
    conversationId: string;
    sessionId: string;
}
export interface MessageRespondedEvent extends BaseEvent {
    type: 'message.responded';
    conversationId: string;
    latencyMs: number;
    tokensUsed: number;
    provider: string;
    model: string;
}
export interface ConversationStartedEvent extends BaseEvent {
    type: 'conversation.started';
    conversationId: string;
    sessionId: string;
}
export interface ConversationEndedEvent extends BaseEvent {
    type: 'conversation.ended';
    conversationId: string;
    durationMs: number;
}
export interface WidgetLoadedEvent extends BaseEvent {
    type: 'widget.loaded';
    referrer: string | null;
    userAgent: string | null;
}
export interface LlmErrorEvent extends BaseEvent {
    type: 'error.llm';
    conversationId: string;
    provider: string;
    errorCode: string;
    errorMessage: string;
}
export type AnalyticsEvent = MessageSentEvent | MessageRespondedEvent | ConversationStartedEvent | ConversationEndedEvent | WidgetLoadedEvent | LlmErrorEvent;
export {};
//# sourceMappingURL=events.types.d.ts.map