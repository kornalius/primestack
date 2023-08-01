import { T18N } from '@/shared/interfaces/commons'
import { alphanumeric, getLocale } from '../helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !val.match(alphanumeric[getLocale().substring(0, 2)])
      ? t('field_errors.alphanumeric')
      : true
  )
)
