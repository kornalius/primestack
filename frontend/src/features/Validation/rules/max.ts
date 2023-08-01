import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { maxValue }: { maxValue: number }) => (
  (val: string | undefined | null): true | string => (
    Number.isNaN(Number(val)) || Number(val) > maxValue
      ? t('field_errors.max', { count: maxValue })
      : true
  )
)
