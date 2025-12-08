import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), react()],
  server: mode === 'development' ? {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // local backend
        changeOrigin: true,
        secure: false,
      },
    },
  } : undefined,
  build: {
    outDir: 'dist',
  },
}))
