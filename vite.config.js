import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcssVite from "@tailwindcss/vite";

import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => ({
  plugins: [
    vue(),
    mode === 'development' && (await import('vite-plugin-vue-devtools')).default(),
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
          'vendor-three': ['three'],
        }
      }
    }
  }
}))
