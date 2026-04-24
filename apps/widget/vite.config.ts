import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), cssInjectedByJs()],
  define: {
    // Required for IIFE builds — React checks process.env.NODE_ENV at runtime
    'process.env.NODE_ENV': '"production"',
  },
  resolve: {
    alias: {
      '@chatbot/shared': resolve(__dirname, '../../packages/shared/src'),
    },
  },
  build: {
    lib: {
      // Entry point exposes the ChatbotWidget global
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ChatbotWidget',
      formats: ['iife'],
      fileName: () => 'widget.js',
    },
    rollupOptions: {
      // React bundled in — single-file output, no external deps required
      external: [],
      output: {
        // Global name used when loaded via <script> tag
        globals: {},
      },
    },
  },
})
