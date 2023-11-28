import { createI18n } from 'vue-i18n'
import { getEnv } from '@/utils/env'

import fr from '@/shared/locales/fr.json'
import en from '@/shared/locales/en.json'

const I18N_LOCALE = getEnv(import.meta.env.VITE_I18N_LOCALE) as string | undefined
const I18N_FALLBACK_LOCALE = getEnv(import.meta.env.VITE_I18N_FALLBACK_LOCALE) as
  string | undefined

const locales = {
  en,
  fr,
}

type MessageSchema = typeof en | typeof fr

// Create VueI18n instance with options
const i18n = createI18n<[MessageSchema], 'en' | 'fr'>({
  locale: I18N_LOCALE || 'en',
  fallbackLocale: I18N_FALLBACK_LOCALE || 'en',
  allowComposition: true,
  messages: locales,
  silentTranslationWarn: true,
  globalInjection: true,
  legacy: false,
})

export default i18n
