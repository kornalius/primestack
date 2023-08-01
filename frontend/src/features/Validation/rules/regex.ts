import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { value, caseSensitive }: { value: string, caseSensitive: boolean }) => (
  (val: string | undefined | null): true | string => (
    !val.match(new RegExp(value, caseSensitive ? 'i' : undefined))
      ? t('field_errors.regex', { value })
      : true
  )
)
