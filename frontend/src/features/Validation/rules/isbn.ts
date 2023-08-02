import { T18N } from '@/shared/interfaces/commons'
import { possibleIsbn10, possibleIsbn13 } from '../helpers'

const factor = [1, 3]

const isISBN = (isbn: string, version: string) => {
  if (!version) {
    return isISBN(isbn, '10') || isISBN(isbn, '13')
  }

  const sanitizedIsbn = isbn.replace(/[\s-]+/g, '')

  let checksum = 0

  if (version === '10') {
    if (!possibleIsbn10.test(sanitizedIsbn)) {
      return false
    }

    for (let i = 0; i < Number(version) - 1; i++) {
      checksum += (i + 1) * Number(sanitizedIsbn.charAt(i))
    }

    if (sanitizedIsbn.charAt(9) === 'X') {
      checksum += 10 * 10
    } else {
      checksum += 10 * Number(sanitizedIsbn.charAt(9))
    }

    if ((checksum % 11) === 0) {
      return true
    }
  } else if (version === '13') {
    if (!possibleIsbn13.test(sanitizedIsbn)) {
      return false
    }

    for (let i = 0; i < 12; i++) {
      checksum += factor[i % 2] * Number(sanitizedIsbn.charAt(i))
    }

    if (Number(sanitizedIsbn.charAt(12)) - ((10 - (checksum % 10)) % 10) === 0) {
      return true
    }
  }

  return false
}

export default (t: T18N, { version }: { version: string }) => (
  (val: string | undefined | null): true | string => (
    !isISBN(val, version)
      ? t('field_errors.isbn')
      : true
  )
)
