import { jsx as _jsx } from "react/jsx-runtime";
import { MessageCircle, X } from 'lucide-react';
export function Bubble({ open, onClick, bubbleColor }) {
    return (_jsx("button", { onClick: onClick, "aria-label": open ? 'Close chat' : 'Open chat', className: "w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95", style: { backgroundColor: bubbleColor }, children: open ? _jsx(X, { size: 24 }) : _jsx(MessageCircle, { size: 24 }) }));
}
//# sourceMappingURL=Bubble.js.map