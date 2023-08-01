import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    val !== val.toUpperCase()
      ? t('field_errors.uppercase')
      : true
  )
)
