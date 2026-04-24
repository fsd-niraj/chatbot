import { createRoot } from 'react-dom/client'
import { createElement } from 'react'
import { configure } from './lib/api'
import { App } from './components/App'
import type { WidgetInitConfig } from './types'

// Import Tailwind base styles
import './styles.css'

interface ChatbotWidgetSDK {
  init: (config: WidgetInitConfig) => void
}

function init(config: WidgetInitConfig): void {
  const { apiKey, backendUrl, containerId } = config

  configure(apiKey, backendUrl)

  const mountTarget = containerId
    ? document.getElementById(containerId) ?? document.body
    : document.body

  const container = document.createElement('div')
  container.id = 'chatbot-widget-root'
  mountTarget.appendChild(container)

  const root = createRoot(container)
  root.render(createElement(App, { apiKey }))
}

const ChatbotWidget: ChatbotWidgetSDK = { init }

// Expose as global for <script> tag usage
if (typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>)['ChatbotWidget'] = ChatbotWidget
}

export { init }
