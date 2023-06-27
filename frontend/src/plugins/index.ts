// Plugins
import type { App } from 'vue'
import { loadFonts } from './webfontloader'
import { pinia } from './pinia'
import router from './router'
import i18n from './i18n'

export function registerPlugins(app: App): void {
  loadFonts()
  app
    .use(pinia)
    .use(router)
    .use(i18n)
}
