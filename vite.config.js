import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/bp': {
        target: 'https://babyplanet.pk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bp/, ''),
        headers: {
          'Referer': 'https://babyplanet.pk',
          'Origin': 'https://babyplanet.pk',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    }
  }
})
