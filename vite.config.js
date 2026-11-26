import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { portfolioApiPlugin } from './vite-portfolio-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    portfolioApiPlugin()
  ],
  server: {
    port: 7004,
    host: '0.0.0.0',
    allowedHosts: ['chitra.cyberpunk.co.in', 'chitrademo2.cyberpunk.co.in', '.cyberpunk.co.in', 'chitraweddings.com', '.chitraweddings.com'],
  },
  preview: {
    port: 7004,
    host: '0.0.0.0',
    allowedHosts: ['chitra.cyberpunk.co.in', 'chitrademo2.cyberpunk.co.in', '.cyberpunk.co.in', 'chitraweddings.com', '.chitraweddings.com'],
  },
})
