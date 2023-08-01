import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { minLength }: { minLength: number }) => (
  (val: string | undefined | null): true | string => (
    val?.length < minLength
      ? t('field_errors.minLength', { length: minLength })
      : true
  )
)
