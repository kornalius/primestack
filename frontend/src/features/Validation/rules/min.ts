import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { minValue }: { minValue: number }) => (
  (val: string | undefined | null): true | string => (
    Number.isNaN(Number(val)) || Number(val) < minValue
      ? t('field_errors.min', { count: minValue })
      : true
  )
)
