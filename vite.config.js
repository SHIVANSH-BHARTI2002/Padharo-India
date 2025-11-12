import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      // Proxy all requests starting with /api
      '/api': {
        target: 'http://localhost:8080', // Backend server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // If you're running on http
      },
      // Proxy static uploads so paths like /uploads/profile/xxx work in dev
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})