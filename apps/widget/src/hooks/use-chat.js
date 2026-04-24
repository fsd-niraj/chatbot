import { useState, useCallback } from 'react';
import { ENDPOINTS } from '@chatbot/shared';
import { apiFetch } from '../lib/api';
import { saveHistory, loadHistory } from '../lib/storage';
export function useChat(sessionId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const loadSessionHistory = useCallback(async (sid) => {
        const cached = loadHistory(sid);
        if (cached.length > 0)
            setMessages(cached);
        try {
            const data = await apiFetch(ENDPOINTS.CHAT_HISTORY(sid));
            if (data.messages.length > 0) {
                setMessages(data.messages);
                saveHistory(sid, data.messages);
            }
        }
        catch {
            // Use cached on error
            setError('Failed to load cache');
        }
    }, []);
    const sendMessage = useCallback(async (content) => {
        const userMsg = {
            id: crypto.randomUUID(),
            conversationId: '',
            role: 'user',
            content,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => {
            const next = [...prev, userMsg];
            saveHistory(sessionId, next);
            return next;
        });
        setLoading(true);
        try {
            const data = await apiFetch(ENDPOINTS.CHAT_MESSAGE, {
                method: 'POST',
                body: JSON.stringify({ message: content, sessionId }),
            });
            setMessages((prev) => {
                const next = [...prev, data.message];
                saveHistory(sessionId, next);
                return next;
            });
        }
        catch {
            setError('Failed...');
        }
        finally {
            setLoading(false);
        }
    }, [sessionId]);
    return { messages, loading, sendMessage, loadSessionHistory, error };
}
//# sourceMappingURL=use-chat.js.map