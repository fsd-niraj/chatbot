import type { ChatbotPublicConfig } from '@chatbot/shared';
import type { Message } from '@chatbot/shared';
interface Props {
    config: ChatbotPublicConfig;
    messages: Message[];
    loading: boolean;
    onSend: (message: string) => void;
    onClose: () => void;
    error?: string;
}
export declare function ChatWindow({ config, messages, loading, onSend, onClose, error }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ChatWindow.d.ts.map