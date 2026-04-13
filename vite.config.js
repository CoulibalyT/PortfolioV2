import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcssVite from "@tailwindcss/vite";

import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    mode === 'development' && (async () => {
      const { default: devtools } = await import('vite-plugin-vue-devtools')
      return devtools()
    })(),
    tailwindcssVite(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'vue-i18n'],
          'vendor-gsap': ['gsap'],
        }
      }
    }
  }
}))
