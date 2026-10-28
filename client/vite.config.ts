import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', 'three', 'framer-motion', 'lucide-react', 'gsap'],
    exclude: ['react-icons', 'react-icons/si', 'react-icons/fa6', 'react-icons/fa'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons';
            }
          }
        },
      },
    },
  },
})
