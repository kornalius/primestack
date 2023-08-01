import { T18N } from '@/shared/interfaces/commons'
import { email } from '../helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    val.match(email)
      ? t('field_errors.email')
      : true
  )
)
