import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    proxy: {
      // Proxy all requests starting with /api
      '/api': {
        target: 'http://localhost:5173', // Your backend server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // If you're running on http
      }
    }
  }
})