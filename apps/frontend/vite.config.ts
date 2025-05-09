import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows the app to be accessed from other devices on the same network
    host: '0.0.0.0',
    // Configure proxy for API requests
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // For client-side routing
  build: {
    outDir: 'dist',
    // Generate a _redirects file for Netlify or similar
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          return assetInfo.name === '_redirects' ? '_redirects' : 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  publicDir: 'public',
  // Create a fallback so all routes are handled by index.html
  preview: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
  }
})
