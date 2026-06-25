import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/openverse': {
        target: 'https://api.openverse.engineering',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openverse/, '')
      },
      '/api/commons': {
        target: 'https://commons.wikimedia.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/commons/, '')
      }
    }
  }
})
