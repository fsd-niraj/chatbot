import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Send } from 'lucide-react';
export function MessageInput({ onSend, disabled }) {
    const [value, setValue] = useState('');
    const textareaRef = useRef(null);
    const submit = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled)
            return;
        onSend(trimmed);
        setValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };
    const handleInput = () => {
        const el = textareaRef.current;
        if (!el)
            return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    };
    return (_jsxs("div", { className: "flex items-end gap-2 px-4 py-3 border-t border-gray-100", children: [_jsx("textarea", { ref: textareaRef, rows: 1, value: value, onChange: (e) => setValue(e.target.value), onKeyDown: handleKeyDown, onInput: handleInput, placeholder: "Type a message\u2026", disabled: disabled, className: "flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-[var(--cb-text)] bg-[var(--cb-bg)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--cb-primary)] focus:border-transparent disabled:opacity-50 max-h-[120px] overflow-y-auto" }), _jsx("button", { onClick: submit, disabled: disabled || !value.trim(), "aria-label": "Send message", className: "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--cb-primary)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity", children: _jsx(Send, { size: 16 }) })] }));
}
//# sourceMappingURL=MessageInput.js.map