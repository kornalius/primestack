import dayjs from 'dayjs'

const patterns = {
  mongoId: {
    string: '[a-f\\d]{24}',
    regex: /^[a-f\d]{24}$/gi,
  },
  phone: {
    string: '(\\d{3})\\s\\d{3}-\\d{4}',
    regex: /^\(\d{3}\)\s\d{3}-\d{4}$/g,
  },
  alphaAndDiacritic: {
    string: '[a-zA-Z\\u00C0-\\u017F]+',
    regex: /^[a-zA-Z\u00C0-\u017F]+$/g,
  },
  numeric: {
    string: '\\d+',
    regex: /^\d+$/g,
  },
  email: {
    string: '([a-zA-Z\\d_.-])+@(([a-zA-Z\\d-])+\\.)+([a-zA-Z\\d]{2,4})+',
    regex: /^([a-zA-Z\d_.-])+@(([a-zA-Z\d-])+\.)+([a-zA-Z\d]{2,4})+$/g,
  },
}

export const usePatterns = (): typeof patterns => patterns

/**
 * Checks if a string matches a numeric
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const numeric = (str: string | number): string | null => {
  const newString = str?.toString()
  if (newString) {
    return newString.match(patterns.numeric.regex) ? newString : null
  }
  return 'valid'
}

/**
 * Checks if a string matches has no accents
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const unaccented = (str: string): string | null => {
  const newStr = str?.toString()
  if (newStr) {
    return newStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '') || null
  }
  return 'valid'
}

/**
 * Checks if a string is made of only alpha and diacritic characters
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const alpha = (str: string): string | null => {
  const newStr = str?.toString()
  if (newStr) {
    return newStr.match(patterns.alphaAndDiacritic.regex) ? newStr : null
  }
  return 'valid'
}

/**
 * Checks if a string matches a phone number
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const phone = (str: string | number): string | null => {
  let newStr = str?.toString()
  if (newStr) {
    if (newStr.length !== 10 && !(newStr.length === 11 && newStr.charAt(0) === '1')) return null
    if (newStr.length === 11 && newStr.charAt(0) === '1') newStr = newStr.substring(1, 11)
    newStr = `(${newStr.substring(0, 3)}) ${newStr.substring(3, 6)}-${newStr.substring(6, 9)}`
    return newStr.match(patterns.phone.regex) ? newStr : null
  }
  return 'valid'
}

/**
 * Checks if a string matches a UUID
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const mongoId = (str: string): string | null => str?.match(patterns.mongoId.regex)?.[0] || null

/**
 * Checks if a string matches an email
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const email = (str: string): string | null => {
  const newStr = str?.toString()
  if (newStr) {
    return newStr?.match(patterns.email.regex) ? newStr : null
  }
  return 'valid'
}

/**
 * Checks if a string matches a date and is before today
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const birthday = (str: string): string | null => {
  const newStr = str?.toString()
  if (newStr) {
    return dayjs().isAfter(dayjs(newStr)) ? str : null
  }
  return 'valid'
}

export const useParser = () => ({
  numeric,
  alpha,
  phone,
  mongoId,
  unaccented,
  email,
  birthday,
})

export default {}
