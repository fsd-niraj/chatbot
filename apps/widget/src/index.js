import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { configure } from './lib/api';
import { App } from './components/App';
// Import Tailwind base styles
import './styles.css';
function init(config) {
    const { apiKey, backendUrl, containerId } = config;
    configure(apiKey, backendUrl);
    const mountTarget = containerId
        ? document.getElementById(containerId) ?? document.body
        : document.body;
    const container = document.createElement('div');
    container.id = 'chatbot-widget-root';
    mountTarget.appendChild(container);
    const root = createRoot(container);
    root.render(createElement(App, { apiKey }));
}
const ChatbotWidget = { init };
// Expose as global for <script> tag usage
if (typeof window !== 'undefined') {
    ;
    window['ChatbotWidget'] = ChatbotWidget;
}
export { init };
//# sourceMappingURL=index.js.map