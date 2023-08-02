import { T18N } from '@/shared/interfaces/commons'
import { getLocale, postalCodes } from '../helpers'

export default (t: T18N, { locale }: { locale: string }) => (
  (val: string | undefined | null): true | string => {
    const l = getLocale().substring(-2)
    if (locale === 'current' && l in postalCodes) {
      if (postalCodes[l].test(val)) {
        return true
      }
    }

    if (locale === 'any') {
      const c = Object.keys(postalCodes).find((k) => postalCodes[k].test(val))
      if (c) {
        return true
      }
    }

    return t('field_errors.postalcode')
  }
)
