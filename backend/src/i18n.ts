import i18next from 'i18next'
import { Application } from '@/declarations'
import fr from '@/shared/locales/fr.json'
import en from '@/shared/locales/en.json'

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
}

export default async (app: Application) => (
  i18next.init({
    lng: app.get('locale') || 'en' as string,
    fallbackLng: app.get('fallbackLocale') || 'en' as string,
    debug: app.get('debug') as string === 'verbose',
    resources,
  })
)
