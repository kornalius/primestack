import dayjs from 'dayjs'

type ParserFunction = { (string: string): string | null }

const patterns = {
  uuid: {
    string: '[\\dA-F]{8}-[\\dA-F]{4}-[1-5][\\dA-F]{3}-[89AB][\\dA-F]{3}-[\\dA-F]{12}',
    regex: /^[\dA-F]{8}-[\dA-F]{4}-[1-5][\dA-F]{3}-[89AB][\dA-F]{3}-[\dA-F]{12}$/gi,
  },
  phone: {
    string: '(\\d{3})\\s\\d{3}-\\d{4}',
    regex: /^\(\d{3}\)\s\d{3}-\d{4}$/g,
  },
  sin: {
    string: '\\d{3}\\s\\d{3}\\s\\d{3}',
    regex: /^\d{3}\s\d{3}\s\d{3}$/g,
  },
  alphaAndDiacritic: {
    regex: /^[a-zA-Z\u00C0-\u017F]+$/g,
  },
  numeric: {
    regex: /^\d+$/g,
  },
  searchTab: {
    string: '^0{8}',
    regex: /^0{8}/,
  },
  email: {
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
 * Checks if a string matches a SIN
 *
 * @param {string} str
 *
 * @returns {boolean}
 */
export const sin = (str: string | null | number): string | null => {
  const newStr = str?.toString().replace(' ', '')
  if (newStr) {
    const s = `${newStr.substring(0, 3)} ${newStr.substring(3, 6)} ${newStr.substring(6, 9)}`
    return s.match(patterns.sin.regex) ? s : null
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
export const uuid = (str: string): string | null => str?.match(patterns.uuid.regex)?.[0] || null

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

export const useParser = (): {
  numeric: ParserFunction
  alpha: ParserFunction
  phone: ParserFunction
  sin: ParserFunction
  uuid: ParserFunction
  unaccented: ParserFunction
  email: ParserFunction
  birthday: ParserFunction
} => ({
  numeric,
  alpha,
  phone,
  sin,
  uuid,
  unaccented,
  email,
  birthday,
})

export default {}
