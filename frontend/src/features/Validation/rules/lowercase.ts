import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    val !== val.toLowerCase()
      ? t('field_errors.lowercase')
      : true
  )
)
