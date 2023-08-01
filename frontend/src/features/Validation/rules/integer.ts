import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !val.match(/^[-+]?[0-9]+$/)
      ? t('field_errors.integer')
      : true
  )
)
