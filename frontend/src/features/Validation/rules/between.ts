import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { minValue, maxValue }: { minValue: number, maxValue: number }) => (
  (val: string | undefined | null): true | string => (
    Number.isNaN(Number(val)) || Number(val) < minValue || Number(val) > maxValue
      ? t('field_errors.between', { min: minValue, max: maxValue })
      : true
  )
)
