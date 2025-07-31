import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8008,
    host: true,
  },
  preview: {
    port: 8008,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
