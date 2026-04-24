export interface AnalyticsOverview {
    totalMessages: number;
    totalConversations: number;
    totalUniqueUsers: number;
    avgMessagesPerConversation: number;
    avgResponseLatencyMs: number;
    periodStart: string;
    periodEnd: string;
}
export interface MessageDataPoint {
    date: string;
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
}
export interface SessionDataPoint {
    date: string;
    totalSessions: number;
    newSessions: number;
}
export interface AnalyticsQuery {
    from: string;
    to: string;
    period?: 'hour' | 'day';
}
export interface AdminStats {
    totalOrganizations: number;
    totalChatbotInstances: number;
    totalMessages: number;
    totalConversations: number;
}
//# sourceMappingURL=analytics.types.d.ts.map