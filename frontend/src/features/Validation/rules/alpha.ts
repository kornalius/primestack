import { T18N } from '@/shared/interfaces/commons'
import { alpha, getLocale } from '../helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !val.match(alpha[getLocale().substring(0, 2)])
      ? t('field_errors.alpha')
      : true
  )
)
