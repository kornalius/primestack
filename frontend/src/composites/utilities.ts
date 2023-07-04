import {
  RouteLocationNormalized, RouteRecordNormalized, RouteRecordRaw,
} from 'vue-router'
// import { useI18n } from 'vue-i18n'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import dayjs, { Dayjs } from 'dayjs'
import { AnyData } from '@/shared/commons'

// /**
//  * Convert an array of values into options array to be used with comboboxes
//  *
//  * @param {unknown[]} list
//  *
//  * @returns {DropdownOption[]}
//  */
// export const toOptions = (list: string | unknown[] | AnyData): DropdownOption[] => {
//   // If list is an array of strings
//   if (Array.isArray(list) && list.every((item) => typeof item === 'string')) {
//     return list.map((item: string) => ({
//       value: item,
//       text: item,
//     })) as DropdownOption[]
//   }
//   return Object.entries(list || {}).map((item) => ({
//     value: item[0],
//     text: item[1],
//   })) as DropdownOption[]
// }
//
// export const localeOptions = (localeKey: string): DropdownOption[] => {
//   const { tm } = useI18n()
//   return toOptions(tm(localeKey) as DropdownOption[])
// };

/**
 * Returns the number of days difference between now and date provided
 *
 * @param {string} date
 *
 * @returns {number}
 */
export const endsIn = (date: string): number => dayjs(date).diff(dayjs(), 'days')

/**
 * Returns a readable string from a date
 *
 * @param {Date} date
 *
 * @returns {string}
 */
export const readableDate = (date: Date): string => (!date ? '' : new Date(date).toISOString())
  .replace('T', ' ')
  .replace(/:\d{2}\.\d{3}Z$/, '')

/**
 * Does a deep difference between two objects
 *
 * @param {object} newValue
 * @param {object} oldValue
 *
 * @returns {object}
 */
export const deepDiff = (
  newValue: Record<string, AnyData>,
  oldValue: Record<string, AnyData>,
): Record<string, AnyData> => Object.keys(newValue).reduce((acc, key: string): Record<string, AnyData> => {
  // Checks that isn't an object and isn't equal
  if (!(typeof newValue[key] === 'object' && isEqual(newValue[key], oldValue[key]))) {
    return { ...acc, [key]: newValue[key] }
  }
  // If is an object, and the object isn't equal
  if ((typeof newValue[key] === 'object' && !isEqual(newValue[key], oldValue[key]))) {
    return { ...acc, [key]: deepDiff(newValue[key], oldValue[key]) }
  }

  // Otherwise, no diff has been observed
  return acc
}, {})

export const scanDiff = (v1: AnyData, v2: AnyData): AnyData => {
  if (!v2 || typeof v1 !== typeof v2) {
    return v1
  }

  if (['boolean', 'string', 'number'].includes(typeof v1)) {
    return v1.toString().replace(/^null$/g, '') !== v2.toString().replace(/^null$/g, '')
      ? v1 : undefined
  }

  if (Array.isArray(v1) && Array.isArray(v2)) {
    return v1.map((item, i) => scanDiff(item[i], v2[i])).filter((item) => !!item)
  }

  if (typeof v1 === 'object') {
    return Object.keys(v1).reduce((acc, key) => {
      const d = scanDiff(v1[key], v2[key])

      if (d && Array.isArray(d) && !d.length) {
        return acc
      }

      if (d) {
        return {
          ...acc,
          [key]: d,
        }
      }
      return acc
    }, {})
  }

  throw new Error(`Can't process type ${typeof v1}`)
}

/**
 * Returns the id or __id from a document
 *
 * @param data
 */
export const getId = (data?: AnyData): string | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  data?._id || data?.__id
)

/**
 * Returns a formatted ISO date + time string from a datetime
 * @param datetime {Date | Dayjs | string | number | undefined}
 * @returns {string}
 */
export const dateIsoString = (datetime?: Date | Dayjs | string | number | undefined): string => (
  dayjs(datetime).toISOString().replace(/\.\d+Z$/, 'Z')
)

/**
 * Returns a formatted date string from a datetime
 * @param datetime {Date | Dayjs | string | number | undefined}
 * @returns {string}
 */
export const dateFormat = (datetime?: Date | Dayjs | string | number | undefined): string => (
  dayjs(datetime).format('YYYY-MM-DD')
)

/**
 * Returns a formatted time string from a datetime
 * @param datetime {Date | Dayjs | string | number | undefined}
 * @param withSecs {boolean}
 * @returns {string}
 */
export const timeFormat = (datetime?: Date | Dayjs | string | number | undefined, withSecs = false): string => (
  dayjs(datetime).format(withSecs ? 'HH:mm:ss' : 'HH:mm')
)

export const routeMeta = (
  route: RouteLocationNormalized | RouteRecordNormalized | RouteRecordRaw,
  path: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  ...args
): void | Promise<void> | string | number | boolean | AnyData | undefined => {
  const m = get(route?.meta, path)
  if (typeof m === 'function') {
    return m(...args)
  }
  return m
}

/**
 * Returns true if the value is '', undefined or null
 *
 * @param value {string | undefined | null}
 *
 * @returns {boolean}
 */
export const isBlank = (value: string | undefined | null): boolean => (
  value === '' || value === undefined || value === null
)

/**
 * Normalize to seperate the accents into their own characters (between 0x0300 - 0x036f)
 * and the removes them from the string.
 *
 * https://www.fileformat.info/info/unicode/char/0300/index.htm
 *
 * ex: toNormalForm('Text with äâëüíőń') => aaeuion
 *
 * @param str {string}
 *
 * @returns {string}
 */
export const removeAccentsFromString = (str: string): string => (
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
)

export default {}
