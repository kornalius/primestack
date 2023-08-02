import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { values }: { values: string }) => (
  (val: string | undefined | null): true | string => {
    const list = values.split(',').map((l) => l.trim())
    return list.includes(val)
      ? t('field_errors.reject', { words: list.join(',') })
      : true
  }
)
