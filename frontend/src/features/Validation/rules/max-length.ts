import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { maxLength }: { maxLength: number }) => (
  (val: string | undefined | null): true | string => (
    val?.length > maxLength
      ? t('field_errors.maxLength', { length: maxLength })
      : true
  )
)
