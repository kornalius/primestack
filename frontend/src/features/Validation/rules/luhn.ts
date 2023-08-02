import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => {
    const sanitized = val.replace(/[- ]+/g, '')

    let sum = 0
    let shouldDouble = false

    for (let i = sanitized.length - 1; i >= 0; i--) {
      const digit = sanitized.substring(i, (i + 1))
      let tmpNum = parseInt(digit, 10)
      if (shouldDouble) {
        tmpNum *= 2
        if (tmpNum >= 10) {
          sum += ((tmpNum % 10) + 1)
        } else {
          sum += tmpNum
        }
      } else {
        sum += tmpNum
      }
      shouldDouble = !shouldDouble
    }

    return sum % 10 !== 0
      ? t('field_errors.luhn')
      : true
  }
)
