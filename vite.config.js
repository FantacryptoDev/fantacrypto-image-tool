import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { generateOpenAIImage } from './api/_lib/openaiImage.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), openaiDevMiddleware(env.OPENAI_API_KEY)],
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
  }
})

function openaiDevMiddleware(apiKey) {
  return {
    name: 'openai-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/generate-image', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }

        let body = ''
        req.on('data', chunk => { body += chunk })
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          try {
            const { prompt, size, n } = JSON.parse(body || '{}')
            const data = await generateOpenAIImage({ prompt, size, n, apiKey })
            res.statusCode = 200
            res.end(JSON.stringify(data))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: { message: error.message } }))
          }
        })
      })
    }
  }
}
