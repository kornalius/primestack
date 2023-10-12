import { LRUCache } from 'lru-cache'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import minMax from 'dayjs/plugin/minMax'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isBetween from 'dayjs/plugin/isBetween'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import uppercase from 'lodash/upperCase'
import lowercase from 'lodash/lowerCase'
import camelcase from 'lodash/camelCase'
import snakecase from 'lodash/snakeCase'
import kebabcase from 'lodash/kebabCase'
import capitalize from 'lodash/capitalize'
import isNull from 'lodash/isNull'
import isNil from 'lodash/isNil'
import isUndefined from 'lodash/isUndefined'
import max from 'lodash/max'
import min from 'lodash/min'
import round from 'lodash/round'
import floor from 'lodash/floor'
import ceil from 'lodash/ceil'
import clamp from 'lodash/clamp'
import inRange from 'lodash/inRange'
import random from 'lodash/random'
import get from 'lodash/get'
import set from 'lodash/set'
import merge from 'lodash/merge'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import pad from 'lodash/pad'
import padStart from 'lodash/padStart'
import padEnd from 'lodash/padEnd'
import startsWith from 'lodash/startsWith'
import endsWith from 'lodash/endsWith'
import trim from 'lodash/trim'
import escape from 'lodash/escape'
import unescape from 'lodash/unescape'
import repeat from 'lodash/repeat'
import split from 'lodash/split'
import replace from 'lodash/replace'
import { printf } from 'fast-printf'
import expr2fn from 'kornalius-expr2fn'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { LocationQueryValue, useRoute, useRouter } from 'vue-router'
import { useFeathers } from '@/composites/feathers'
import { useSnacks } from '@/features/Snacks/store'
import { useVariables } from '@/features/Variables/store'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/App/editor-store'
import { useApp } from '@/features/App/store'
import { useUrl } from '@/composites/url'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exec } from '@/features/Actions/composites'

dayjs.extend(weekOfYear)
dayjs.extend(dayOfYear)
dayjs.extend(quarterOfYear)
dayjs.extend(minMax)
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(isBetween)
dayjs.extend(isLeapYear)

export const isExpr = (v: unknown): boolean => (
  typeof v === 'string' && v.startsWith('```') && v.endsWith('```')
)

export const exprCode = (v: string): string => (
  isExpr(v) ? v.substring(3, v.length - 3) : undefined
)

export const exprToString = (v: string): string => (
  isExpr(v) ? v.substring(3, v.length - 3) : v
)

export const stringToExpr = (v: string): string => {
  const quotes = '```'
  return `${quotes}${exprToString(v)}${quotes}`
}

const options = {
  max: 500,
  ttl: 1000 * 60 * 5,
  allowStale: false,
  updateAgeOnGet: false,
  updateAgeOnHas: false,
}

const cache = new LRUCache(options)

export const runExpr = (v: string, ctx: AnyData): unknown => {
  let fn = cache.get(v) as (ctx: AnyData) => unknown
  if (!fn) {
    try {
      fn = expr2fn(v) as ((ctx: AnyData) => unknown)
      cache.set(v, fn)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e, v)
    }
  }
  let r: unknown
  try {
    if (typeof fn === 'function') {
      r = fn(ctx)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
  return r
}

export const getProp = (v: unknown, ctx: AnyData): unknown => (
  isExpr(v) ? runExpr(exprCode(v as string), ctx.$expr) : v
)

export const buildCtx = (extra?: AnyData) => {
  const { t } = useI18n()
  const quasar = useQuasar()
  const { api } = useFeathers()
  const snacks = useSnacks()
  const store = useVariables()
  const route = useRoute()
  const router = useRouter()
  const editor = useAppEditor()
  const app = useApp()
  const url = useUrl()
  const variables = useVariables()

  return {
    quasar,
    snacks,
    api,
    editor,
    t,
    store,
    route,
    router,
    app,
    url,
    variables,
    exec,
    ...(extra || {}),
    $expr: {
      /**
       * Get the previous action result or key value from it
       *
       * @param path Path to get
       *
       * @returns {unknown|undefined}
       */
      $result: (path?: string): unknown | undefined => {
        const r = variables.getRaw('_prevResult')
        return !path
          ? r
          : get(r, path)
      },

      /**
       * Get a variable's value
       *
       * @param name Name of the variable
       *
       * @returns {unknown | undefined} Value of the variable
       */
      var: (name: string): unknown | undefined => (
        variables.get(name) as string
      ),

      /**
       * Get the table id by its name
       *
       * @param name Table name
       *
       * @returns {string | undefined} Id of the table
       */
      table: (name: string): string | undefined => {
        const tables = api.service('tables').findOneInStore({ query: {} })
        const table = tables.value?.list.find((tt: AnyData) => tt.name === name)
        return table?._id
      },

      /**
       * Get the table field id by its name
       *
       * @param tablename Table name
       * @param fieldname Field name
       *
       * @returns {string | undefined} Id of the field
       */
      field: (tablename: string, fieldname: string): string | undefined => {
        const tables = api.service('tables').findOneInStore({ query: {} })
        const table = tables.value?.list.find((tt: AnyData) => tt.name === tablename)
        if (table) {
          return table.fields.find((ff: AnyData) => ff.name === fieldname)?._id
        }
        return undefined
      },

      /**
       * Get the current document field
       *
       * @param fieldname Field name
       *
       * @returns {unknown} Value of the field
       */
      val: (fieldname: string): unknown | undefined => (
        app.doc?.[fieldname]
      ),

      /**
       * Returns the current menu id
       *
       * @returns {string}
       */
      menuId: (): string => app.menuId,

      /**
       * Returns the current tab id
       *
       * @returns {string}
       */
      tabId: (): string => app.tabId,

      /**
       * Returns the current form id
       *
       * @returns {string}
       */
      formId: (): string => app.formId,

      /**
       * Returns the current table id
       *
       * @returns {string}
       */
      tableId: (): string => app.tableId,

      /**
       * Returns the current table selected rows
       *
       * @returns {unknown[]}
       */
      selection: (): unknown[] => app.selection,

      /**
       * Super powerful string builder
       *
       * @param def String builder definition
       * @param values Object of the values to build the string with
       *
       * @return {string} Newly built string
       */
      str: (def: string, values: AnyData): string => {
        if (typeof def !== 'string') {
          throw new Error('The argument must be a string type')
        }

        const es6TemplateRegex = /(\\)?\$\{([^{}\\]+)}/g

        let declarations = ''

        Object.keys(values).forEach((key) => {
          if (values.hasOwnProperty.call(values, key)) {
            declarations = `${declarations}var ${key}=locals['${key}'];`
          }
        })

        const parse = (variable: string): string => {
          const exp = variable.match(/\{(.*)}/)[1]

          if (variable[0] === '\\') {
            return variable.slice(1)
          }

          const parts = exp.split(':')

          let r = ''
          try {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            r = Function('locals', `${declarations} return ${parts[0]}`)(values)
          } catch (e) {
            //
          }

          if (parts.length === 2) {
            return printf(parts[1], r)
          }

          return r
        }

        return def.replace(es6TemplateRegex, (matched: string) => parse(matched))
      },

      /**
       * Returns the current browser url
       *
       * @returns {string} Browser url
       */
      route: (): string => router.currentRoute.value.path,

      /**
       * Get a url parameter
       *
       * @param name Parameter name
       *
       * @return {LocationQueryValue | LocationQueryValue[] | undefined} Url parameter value
       */
      param: (
        name: string,
      ): LocationQueryValue | LocationQueryValue[] | undefined => (
        route.query?.[name]
      ),

      /**
       * Returns the number of milliseconds elapsed since the epoch
       *
       * @returns {number} Milliseconds
       */
      now: (): number => Date.now(),

      // eslint-disable-next-line no-console
      log: (...args: unknown[]) => console.log(...args),

      // eslint-disable-next-line no-console
      error: (...args: unknown[]) => console.error(...args),

      // eslint-disable-next-line no-console
      info: (...args: unknown[]) => console.info(...args),

      // eslint-disable-next-line no-console
      warn: (...args: unknown[]) => console.warn(...args),

      /**
       * Retrieve a localStorage key value
       *
       * @param key Key name
       *
       * @returns {string} Key value
       */
      localStorage: (key: string): string => (
        localStorage.getItem(key)
      ),

      /**
       * Parse a string into a JSON object
       *
       * @param s String to parse
       *
       * @returns {unknown} JSON object
       */
      parse: (s: string): unknown => {
        let r: unknown
        try {
          r = JSON.parse(s)
        } catch (e) {
          //
        }
        return r
      },

      /**
       * Stringify an object and optionally beautify it
       *
       * @param o Object to stringify
       * @param beautify Should we beautify the output
       *
       * @returns {string} String
       */
      stringify: (o: unknown, beautify = false): string | undefined => {
        let s: string
        try {
          s = JSON.stringify(o, undefined, beautify ? 2 : undefined)
        } catch (e) {
          //
        }
        return s
      },

      /**
       * Joins an array by a string
       *
       * @param a Array to join
       * @param by String to join each element by
       *
       * @returns {string} Joined string
       */
      join: (a: string[], by: string): string => a.join(by),

      /**
       * Converts a date into a Date
       *
       * @param d Value to convert
       * @param template Optional template if `d` is a string
       *
       * @returns {Date} Date object
       */
      date: (d: string | number, template?: string): Date => dayjs(d, template).toDate(),

      /**
       * Convert a date into a formatted string
       *
       * @param d Date
       * @param template Template to format the string as
       *
       * @returns {string} Date string
       */
      format: (d: Date | string | number, template: string): string => (
        dayjs(d).format(template)
      ),

      /**
       * Returns the number of seconds of a date
       *
       * @param d Date
       *
       * @returns {number} Seconds
       */
      second: (d: Date): number => (
        dayjs(d).second()
      ),

      /**
       * Returns the number of milliseconds of a date
       *
       * @param d Date
       *
       * @returns {number} Milliseconds
       */
      millisecond: (d: Date): number => (
        dayjs(d).millisecond()
      ),

      /**
       * Returns the number of minutes of a date
       *
       * @param d Date
       *
       * @returns {number} Minutes
       */
      minute: (d: Date): number => (
        dayjs(d).minute()
      ),

      /**
       * Returns the number of hours of a date
       *
       * @param d Date
       *
       * @returns {number} Hours
       */
      hour: (d: Date): number => (
        dayjs(d).hour()
      ),

      /**
       * Returns the day of the month of a date
       *
       * @param d Date
       *
       * @returns {number} Day (1-31)
       */
      day: (d: Date): number => (
        dayjs(d).date()
      ),

      /**
       * Returns the weekday of a date
       *
       * @param d Date
       *
       * @returns {number} Weekday (0-6) (Sunday-Saturday)
       */
      weekday: (d: Date): number => (
        dayjs(d).day()
      ),

      /**
       * Returns the month of a date
       *
       * @param d Date
       *
       * @returns {number} Month (0-11)
       */
      month: (d: Date): number => (
        dayjs(d).month()
      ),

      /**
       * Returns the year of a date
       *
       * @param d Date
       *
       * @returns {number} Year
       */
      year: (d: Date): number => (
        dayjs(d).year()
      ),

      /**
       * Returns the week of the year of a date
       *
       * @param d Date
       *
       * @returns {number} Week of the year (0-51)
       */
      week: (d: Date): number => (
        dayjs(d).week()
      ),

      /**
       * Returns the day of the year of a date
       *
       * @param d Date
       *
       * @returns {number} Day of the year (1-366)
       */
      dayOfYear: (d: Date): number => (
        dayjs(d).dayOfYear()
      ),

      /**
       * Returns the quarter of a date
       *
       * @param d Date
       *
       * @returns {number} Quarter (1-4)
       */
      quarter: (d: Date): number => (
        dayjs(d).quarter()
      ),

      /**
       * Returns the number of days for a giving month of a date
       *
       * @param d Date
       *
       * @returns {number} Number of days (1-31)
       */
      daysInMonth: (d: Date): number => (
        dayjs(d).daysInMonth()
      ),

      /**
       * Returns the biggest date from a list
       *
       * @param d Dates to compare
       *
       * @returns {Date} Biggest date
       */
      dateMax: (d: Date[]): Date => (
        dayjs.max(...(d.map((dt) => dayjs(dt)))).toDate()
      ),

      /**
       * Returns the smallest date from a list
       *
       * @param d Dates to compare
       *
       * @returns {Date} Smallest date
       */
      dateMin: (d: (Date)[]): Date => (
        dayjs.min(...(d.map((dt) => dayjs(dt)))).toDate()
      ),

      /**
       * Adds a number of units to a date
       *
       * @param d Date
       * @param count Number to add
       * @param unit Optional unit
       *
       * @returns {Date} New date
       */
      add: (d: Date, count: number, unit?: dayjs.ManipulateType): Date => (
        dayjs(d).add(count, unit).toDate()
      ),

      /**
       * Subtract a number of units to a date
       *
       * @param d Date
       * @param count Number to subtract
       * @param unit Optional unit
       *
       * @returns {Date} New date
       */
      subtract: (d: Date, count: number, unit?: dayjs.ManipulateType): Date => (
        dayjs(d).subtract(count, unit).toDate()
      ),

      /**
       * Return the start date of a unit
       *
       * @param unit Unit
       *
       * @returns {Date} Date
       */
      startOf: (unit?: dayjs.QUnitType | dayjs.OpUnitType): Date => (
        dayjs().startOf(unit).toDate()
      ),

      /**
       * Return the end date of a unit
       *
       * @param unit Unit
       *
       * @returns {Date} Date
       */
      endOf: (unit?: dayjs.QUnitType | dayjs.OpUnitType): Date => (
        dayjs().endOf(unit).toDate()
      ),

      /**
       * Returns a string of relative time between now and a date
       *
       * @param d Date
       * @param withoutSuffix Optionally remove suffix from string
       *
       * @returns {string} String of relative time
       */
      relative: (d: Date, withoutSuffix = false): string => (
        dayjs(d).fromNow(withoutSuffix)
      ),

      /**
       * Returns the difference in unit between 2 dates
       *
       * @param d1 Date
       * @param d2 Date
       * @param unit Optional unit
       *
       * @returns {number} Relative unit number
       */
      diff: (d1: Date, d2: Date, unit?: dayjs.QUnitType | dayjs.OpUnitType): number => (
        dayjs(d1).diff(dayjs(d2), unit)
      ),

      /**
       * Compares if a date is before than another date
       *
       * @param d1 Date
       * @param d2 Date
       *
       * @returns {boolean} Is d1 < d2
       */
      before: (d1: Date, d2: Date): boolean => (
        dayjs(d1).isBefore(dayjs(d2))
      ),

      /**
       * Compares if a date is after than another date
       *
       * @param d1 Date
       * @param d2 Date
       *
       * @returns {boolean} Is d1 > d2
       */
      after: (d1: Date, d2: Date): boolean => (
        dayjs(d1).isAfter(dayjs(d2))
      ),

      /**
       * Compares if 2 dates are the same
       *
       * @param d1 Date
       * @param d2 Date
       *
       * @returns {boolean} Is d1 = d2
       */
      same: (d1: Date, d2: Date): boolean => (
        dayjs(d1).isSame(dayjs(d2))
      ),

      /**
       * Compares if 2 dates are the same or a date is before
       *
       * @param d1 Date
       * @param d2 Date
       *
       * @returns {boolean} Is d1 <= d2
       */
      sameOrBefore: (d1: Date, d2: Date): boolean => (
        dayjs(d1).isSameOrBefore(dayjs(d2))
      ),

      /**
       * Compares if 2 dates are the same or a date is after
       *
       * @param d1 Date
       * @param d2 Date
       *
       * @returns {boolean} Is d1 >= d2
       */
      sameOrAfter: (d1: Date, d2: Date): boolean => (
        dayjs(d1).isSameOrAfter(dayjs(d2))
      ),

      /**
       * Checks if the year in a date is leap
       *
       * @param d Date
       *
       * @returns {boolean} Is leap?
       */
      leap: (d: Date): boolean => (
        dayjs(d).isLeapYear()
      ),

      uppercase,
      lowercase,
      camelcase,
      snakecase,
      kebabcase,
      capitalize,
      isNull,
      isNil,
      isUndefined,
      max,
      min,
      round,
      floor,
      ceil,
      clamp,
      inRange,
      random,
      get,
      set,
      merge,
      pick,
      omit,
      pad,
      padStart,
      padEnd,
      startsWith,
      endsWith,
      trim,
      escape,
      unescape,
      repeat,
      split,
      replace,
    },
  }
}

export const useExpression = () => ({
  isExpr,
  exprCode,
  exprToString,
  stringToExpr,
  runExpr,
  getProp,
  buildCtx,
})
