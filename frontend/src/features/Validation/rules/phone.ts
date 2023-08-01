import { T18N } from '@/shared/interfaces/commons'
import { phones } from '../helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !Object.keys(phones).find((k) => val.match(phones[k]))
      ? t('field_errors.phone')
      : true
  )
)
