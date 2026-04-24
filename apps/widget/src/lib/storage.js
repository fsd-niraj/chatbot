import { CHAT_HISTORY_KEY } from '@chatbot/shared';
export function saveHistory(sessionId, messages) {
    try {
        const key = `${CHAT_HISTORY_KEY}_${sessionId}`;
        localStorage.setItem(key, JSON.stringify(messages));
    }
    catch {
        // Ignore storage errors
    }
}
export function loadHistory(sessionId) {
    try {
        const key = `${CHAT_HISTORY_KEY}_${sessionId}`;
        const raw = localStorage.getItem(key);
        if (!raw)
            return [];
        return JSON.parse(raw);
    }
    catch {
        return [];
    }
}
//# sourceMappingURL=storage.js.map