/**
 * Algorithm taken from KBala <kbala@adaptivemedia.in> https://github.com/amindia/invoice-number
 */

const alphaNumericIncrementer = (str: string = ''): string => {
  let n = str
    .replace(/([^a-z0-9]+)/gi, '')
    .toUpperCase()
  let i = n.length - 1
  while (i >= 0) {
    if (n[i] === '9') {
      n = `${n.substring(0, i)}0${n.substring(i + 1)}`
    } else if (n[i] === 'Z') {
      n = `${n.substring(0, i)}A${n.substring(i + 1)}`
    } else {
      const char = String.fromCharCode(n.charCodeAt(i) + 1)
      n = `${n.substring(0, i)}${char}${n.substring(i + 1)}`
      i = 0
    }
    i--
  }
  return n
}

/**
 * Returns the next sequential number from a string
 *
 * @param no Previous number as a string
 *
 * @returns {string}
 */
export const next = (no: string = ''): string => {
  const last = no.split(/[_/:\-;\\]+/).pop() || ''
  const prior = no.substring(0, no.indexOf(last))
  const nxt = alphaNumericIncrementer(last)
  return `${prior}${nxt}`
}
