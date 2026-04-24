import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
export function MessageList({ messages, loading }) {
    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);
    return (_jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-1", children: [messages.map((msg) => (_jsx(MessageBubble, { message: msg }, msg.id))), loading && _jsx(TypingIndicator, {}), _jsx("div", { ref: bottomRef })] }));
}
//# sourceMappingURL=MessageList.js.map