import { T18N } from '@/shared/interfaces/commons'
import { ean } from '../helpers'

/**
 * Get position weight given:
 * EAN length and digit index/position
 */
const getPositionWeightThroughLengthAndIndex = (length: number, index: number): number => {
  if (length === 8 || length === 14) {
    return (index % 2 === 0) ? 3 : 1
  }
  return (index % 2 === 0) ? 1 : 3
}

/**
 * Calculate EAN Check Digit
 * Reference: https://en.wikipedia.org/wiki/International_Article_Number#Calculation_of_checksum_digit
 */
const calculateCheckDigit = (val: string): number => {
  const checksum = val
    .slice(0, -1)
    .split('')
    .map((char, index) => (
      Number(char) * getPositionWeightThroughLengthAndIndex(val.length, index)
    ))
    .reduce((acc, partialSum) => acc + partialSum, 0)

  const remainder = 10 - (checksum % 10)
  return remainder < 10 ? remainder : 0
}

export default (t: T18N) => (
  (val: string | undefined | null): true | string => {
    const actualCheckDigit = Number(val.slice(-1))
    return !ean.test(val) || actualCheckDigit !== calculateCheckDigit(val)
      ? t('field_errors.ean')
      : true
  }
)
