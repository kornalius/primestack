import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    val === undefined || val === null || val.length === 0
      ? t('field_errors.required')
      : true
  )
)
