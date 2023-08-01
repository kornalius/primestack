import { T18N } from '@/shared/interfaces/commons'
import { issn } from '../helpers'

export default (t: T18N, { hyphen, caseSensitive }: { hyphen: boolean, caseSensitive: boolean }) => (
  (val: string | undefined | null): true | string => {
    let s = issn.toString()
    s = hyphen ? s.replace('?', '') : s
    const r = caseSensitive ? new RegExp(s) : new RegExp(s, 'i')
    if (!r.test(val)) {
      return t('field_errors.issn')
    }
    const digits = val.replace('-', '').toUpperCase()
    let checksum = 0
    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i]
      checksum += (digit === 'X' ? 10 : +digit) * (8 - i)
    }
    if (checksum % 11 !== 0) {
      return t('field_errors.issn')
    }
    return true
  }
)
