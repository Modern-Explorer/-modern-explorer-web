import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3002',
    },
  },
  build: {
    chunkSizeWarningLimit: 180,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — always needed, in the initial chunk
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/scheduler/')
          ) return 'vendor-react'

          // Router — needed by App shell
          if (
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run/')
          ) return 'vendor-router'

          // Helmet + tiny deps — all pages need SEO meta
          if (
            id.includes('node_modules/react-helmet-async/') ||
            id.includes('node_modules/react-fast-compare/') ||
            id.includes('node_modules/invariant/') ||
            id.includes('node_modules/shallowequal/')
          ) return 'vendor-meta'

          // Stripe — only loaded when booking drawer or /tip route mounts
          if (id.includes('node_modules/@stripe/') || id.includes('node_modules/prop-types/'))
            return 'vendor-stripe'

        },
      },
    },
  },
})
