import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { X } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
export function ChatWindow({ config, messages, loading, onSend, onClose, error }) {
    return (_jsxs("div", { className: "flex flex-col rounded-2xl shadow-2xl overflow-hidden", style: {
            width: '360px',
            height: '520px',
            backgroundColor: 'var(--cb-bg)',
            fontFamily: config.theme.fontFamily ?? 'inherit',
        }, children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3", style: { backgroundColor: 'var(--cb-primary)' }, children: [_jsxs("div", { className: "flex items-center gap-2", children: [config.theme.logoUrl && (_jsx("img", { src: config.theme.logoUrl, alt: "", className: "w-7 h-7 rounded-full object-cover" })), _jsx("span", { className: "text-white font-semibold text-sm", children: config.botName })] }), _jsx("button", { onClick: onClose, "aria-label": "Close chat", className: "text-white/80 hover:text-white transition-colors", children: _jsx(X, { size: 18 }) })] }), _jsx(MessageList, { messages: messages, loading: loading }), error && _jsx("div", { children: error }), _jsx(MessageInput, { onSend: onSend, disabled: loading })] }));
}
//# sourceMappingURL=ChatWindow.js.map