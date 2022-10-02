import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  root: 'src',
  publicDir: path.join(__dirname, '/public'),
  envDir: path.join(__dirname, '.'),
  resolve: {
    alias: {
      '@/': `${path.join(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
    vuetify({ autoImport: true }),
  ],
})
