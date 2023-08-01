import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !val.match(/^(0x|0h)?[0-9A-F]+$/i)
      ? t('field_errors.hexadecimal')
      : true
  )
)
