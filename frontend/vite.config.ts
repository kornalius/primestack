import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import loadVersion from 'vite-plugin-package-version'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    loadVersion(),

    vue({
      template: { transformAssetUrls },
    }),

    VueI18nPlugin({}),

    quasar({
      sassVariables: 'src/quasar-variables.sass',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
})
