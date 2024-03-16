import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server:{
    proxy:{
      '/adminapi': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
