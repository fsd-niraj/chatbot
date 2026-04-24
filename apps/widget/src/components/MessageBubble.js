import { jsx as _jsx } from "react/jsx-runtime";
export function MessageBubble({ message }) {
    const isUser = message.role === 'user';
    return (_jsx("div", { className: `flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`, children: _jsx("div", { className: `max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${isUser
                ? 'bg-[var(--cb-primary)] text-white rounded-br-sm'
                : 'bg-gray-100 text-[var(--cb-text)] rounded-bl-sm'}`, children: message.content }) }));
}
//# sourceMappingURL=MessageBubble.js.map