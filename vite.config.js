import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import newsHandler from './api/news.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-news-dev-middleware',
      configureServer(server) {
        server.middlewares.use('/api/news', async (req, res) => {
          await newsHandler(req, res);
        });
      }
    }
  ],
})
