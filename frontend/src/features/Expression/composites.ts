import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { LRUCache } from 'lru-cache'
import hexObjectId from 'hex-object-id'
import dayjs from 'dayjs'
import sortBy from 'lodash/sortBy'
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
import { useFeathers, useFeathersService } from '@/composites/feathers'
import { useSnacks } from '@/features/Snacks/store'
import { useVariables } from '@/features/Variables/store'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/Editor/store'
import { useApp } from '@/features/App/store'
import { useUrl } from '@/composites/url'
import { useAuth } from '@/features/Auth/store'
import { AnyData, T18N } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exec } from '@/features/Actions/composites'
import { Menu } from '@/features/Expression/interfaces'
import { next } from '@/shared/seqno'
import { categories } from '@/features/Expression/categories'
import { fcts } from '@/features/Expression/fcts'
import { iconForType } from '@/shared/schema'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema } from '@/shared/schemas/form'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'

type MenuSchema = Static<typeof menuSchema>
type TabSchema = Static<typeof tabSchema>
type FormSchema = Static<typeof formSchema>
type TableSchema = Static<typeof tableSchema>
type FieldSchema = Static<typeof tableFieldSchema>

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
  const auth = useAuth()

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
    useFeathersService,
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
       * Returns a url that points to the menuId, tabId, formId specified
       *
       * @param menuId
       * @param tabId
       * @param formId
       * @param create Should we create a new document?
       *
       * @returns {string}
       */
      link: (menuId: string, tabId?: string, formId?: string, create?: boolean): string => (
        url.menuUrl(menuId, tabId, formId, create)
      ),

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
        const tables = useFeathersService('tables').findOneInStore({ query: {} })
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
        const tables = useFeathersService('tables').findOneInStore({ query: {} })
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
       * Get the currently selected whole document
       *
       * @returns {unknown} Value of the document
       */
      doc: (): unknown | undefined => (
        app.doc
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

      /**
       * Log a message to the browser's console
       *
       * @param args
       */
      // eslint-disable-next-line no-console
      log: (...args: unknown[]) => console.log(...args),

      /**
       * Log a message as an error to the browser's console
       *
       * @param args
       */
      // eslint-disable-next-line no-console
      error: (...args: unknown[]) => console.error(...args),

      /**
       * Log a message as an info to the browser's console
       *
       * @param args
       */
      // eslint-disable-next-line no-console
      info: (...args: unknown[]) => console.info(...args),

      /**
       * Log a message as a warning to the browser's console
       *
       * @param args
       */
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

      /**
       * Returns true if o is considered an Array
       *
       * @param o Object to check
       *
       * @returns {boolean}
       */
      isArray: (o: unknown): boolean => (
        Array.isArray(o)
      ),

      /**
       * Concat two arrays together
       *
       * @param a Array 1
       * @param b Array 2
       *
       * @returns {unknown[]}
       */
      concat: (a: unknown[], b: unknown[]): unknown[] => ([
        ...a,
        ...b,
      ]),

      /**
       * Flattens an array
       *
       * @param a Array
       *
       * @returns {unknown[]}
       */
      flat: (a: unknown[]): unknown[] => (
        a.flat()
      ),

      /**
       * Finds the index of an item in an array
       *
       * @param a Array
       * @param item Item to search for
       *
       * @returns {number}
       */
      indexOf: (a: unknown[], item: unknown): number => (
        a.indexOf(item)
      ),

      /**
       * Reverses items in an array
       *
       * @param a Array
       *
       * @returns {unknown[]}
       */
      reverse: (a: unknown[]): unknown[] => (
        a.reverse()
      ),

      /**
       * Pushes a value at the end of the array
       *
       * @param a Array
       * @param item New value to append
       *
       * @returns {unknown[]}
       */
      push: (a: unknown[], item: unknown): unknown[] => ([
        ...a,
        item,
      ]),

      /**
       * Insert a value at the start of the array
       *
       * @param a Array
       * @param item New value to append
       *
       * @returns {unknown[]}
       */
      shift: (a: unknown[], item: unknown): unknown[] => ([
        item,
        ...a,
      ]),

      /**
       * Removes the last entry from an array
       *
       * @param a Array
       *
       * @returns {unknown[]}
       */
      pop: (a: unknown[]): unknown[] => (
        a.slice(0, -1)
      ),

      /**
       * Removes the first entry from an array
       *
       * @param a Array
       *
       * @returns {unknown[]}
       */
      unshift: (a: unknown[]): unknown[] => (
        a.slice(0, 1)
      ),

      /**
       * Slices an array
       *
       * @param a Array
       * @param start Start index
       * @param end End index
       *
       * @returns {unknown[]}
       */
      slice: (a: unknown[], start?: number, end?: number): unknown[] => (
        a.slice(start, end)
      ),

      /**
       * Changes the content of an array by removing or replacing existing items
       *
       * @param a Array
       * @param start Start index
       * @param deleteCount Items to delete
       * @param items New items to insert at start
       *
       * @returns {unknown[]}
       */
      splice: (a: unknown[], start: number, deleteCount?: number, ...items: unknown[]): unknown[] => ([
        ...a.splice(start, deleteCount, ...items),
      ]),

      /**
       * Checks if a value is considered Not-A-Number
       *
       * @param value Value to check
       *
       * @returns {boolean}
       */
      isNaN: (value: unknown): boolean => (
        Number.isNaN(value)
      ),

      /**
       * Checks if a value is considered an integer value
       *
       * @param value Value to check
       *
       * @returns {boolean}
       */
      isInteger: (value: unknown): boolean => (
        Number.isInteger(value)
      ),

      /**
       * Checks if a value is considered a finite value
       *
       * @param value Value to check
       *
       * @returns {boolean}
       */
      isFinite: (value: unknown): boolean => (
        Number.isFinite(value)
      ),

      /**
       * Returns the largest representable number
       *
       * @returns {number}
       */
      MAX_FLOAT: (): number => (
        Number.MAX_VALUE
      ),

      /**
       * Returns the largest safe integer number
       *
       * @returns {number}
       */
      MAX_INT: (): number => (
        Number.MAX_SAFE_INTEGER
      ),

      /**
       * Returns an integer value by parsing a string
       *
       * @param value Value to parse
       *
       * @returns {number}
       */
      parseInt: (value: string): number => (
        Number.parseInt(value, 10)
      ),

      /**
       * Returns an float value by parsing a string
       *
       * @param value Value to parse
       *
       * @returns {number}
       */
      parseFloat: (value: string): number => (
        Number.parseFloat(value)
      ),

      /**
       * PI
       *
       * @returns {number}
       */
      PI: (): number => (
        Math.PI
      ),

      /**
       * Returns a string representing the given number using fixed-point notation
       *
       * @param value
       * @param digits precision
       *
       * @returns {string}
       */
      toFixed: (value: number, digits?: number): string => (
        Number(value).toFixed(digits)
      ),

      /**
       * Returns a string with a language-sensitive representation of this number
       *
       * @param value
       * @param locale
       * @param opt
       *
       * @returns {string}
       */
      toLocale: (value: number, locale?: string, opt?: Intl.NumberFormatOptions): string => (
        Number(value).toLocaleString(locale, opt)
      ),

      /**
       * Returns a string representing the given value
       *
       * @param value
       *
       * @returns {string}
       */
      toString: (value: unknown): string => (
        value.toString()
      ),

      /**
       * Returns the absolute value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      abs: (value: number): number => (
        Math.abs(value)
      ),

      /**
       * Returns the arccosine value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      acos: (value: number): number => (
        Math.acos(value)
      ),

      /**
       * Returns the cosine value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      cos: (value: number): number => (
        Math.cos(value)
      ),

      /**
       * Returns the arcsine value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      asin: (value: number): number => (
        Math.asin(value)
      ),

      /**
       * Returns the sine value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      sin: (value: number): number => (
        Math.sin(value)
      ),

      /**
       * Returns the arctangent value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      atan: (value: number): number => (
        Math.atan(value)
      ),

      /**
       * Returns the tangent value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      tan: (value: number): number => (
        Math.tan(value)
      ),

      /**
       * Returns the base x to the exponent power y (that is, xy)
       *
       * @param x
       * @param y
       *
       * @returns {number}
       */
      pow: (x: number, y: number): number => (
        x ** y
      ),

      /**
       * Returns the sign of the x, indicating whether x is positive, negative, or zero
       *
       * @param value
       *
       * @returns {number}
       */
      sign: (value: number): number => (
        Math.sign(value)
      ),

      /**
       * Returns the positive square root of value
       *
       * @param value
       *
       * @returns {number}
       */
      sqrt: (value: number): number => (
        Math.sqrt(value)
      ),

      /**
       * Returns the integer portion of value, removing any fractional digits
       *
       * @param value
       *
       * @returns {number}
       */
      trunc: (value: number): number => (
        Math.trunc(value)
      ),

      /**
       * Returns the logarithm value of a number
       *
       * @param value
       *
       * @returns {number}
       */
      logarithm: (value: number): number => (
        Math.log(value)
      ),

      /**
       * Returns an array containing all of the [key, value] pairs of a given
       * object's own enumerable string
       *
       * @param value
       *
       * @returns {[string, unknown][]}
       */
      entries: (value: AnyData): [string, unknown][] => (
        Object.entries(value)
      ),

      /**
       * Returns an array of all object enumerable keys
       *
       * @param value
       *
       * @returns {string[]}
       */
      keys: (value: AnyData): string[] => (
        Object.keys(value)
      ),

      /**
       * Returns an array of all object values
       *
       * @param value
       *
       * @returns {unknown[]}
       */
      values: (value: AnyData): unknown[] => (
        Object.values(value)
      ),

      /**
       * Returns true if the specified object has the indicated key
       *
       * @param value
       * @param key
       *
       * @returns {boolean}
       */
      has: (value: AnyData, key: string): boolean => (
        Object.hasOwn(value, key)
      ),

      /**
       * Returns a string from a char code
       *
       * @param value String value
       *
       * @returns {string}
       */
      chr: (value: number): string => (
        String.fromCharCode(value)
      ),

      /**
       * Returns length of a string
       *
       * @param value String value
       *
       * @returns {number}
       */
      length: (value: string): number => (
        value.length
      ),

      /**
       * Returns a char code from a string at the given index
       *
       * @param value String value
       * @param index Char index
       *
       * @returns {number}
       */
      at: (value: string, index: number): number => (
        value.charCodeAt(index)
      ),

      /**
       * Returns value appended with another value
       *
       * @param value String value
       * @param append String to append
       *
       * @returns {string}
       */
      append: (value: string, append: string): string => (
        value.concat(append)
      ),

      /**
       * Returns the index of the first occurence of a search value
       *
       * @param value String value
       * @param search Search string
       *
       * @returns {number}
       */
      index: (value: string, search: string): number => (
        value.indexOf(search)
      ),

      /**
       * Returns the index of the last occurence of a search value
       *
       * @param value String value
       * @param search Search string
       *
       * @returns {number}
       */
      indexLast: (value: string, search: string): number => (
        value.lastIndexOf(search)
      ),

      /**
       * Returns a number indicating whether the reference string
       * str comes before, after, or is equivalent to
       * the given string in sort order
       *
       * @param v String value
       * @param str Search string
       * @param locale Locale name
       * @param opt Locale options
       *
       * @returns {number}
       */
      compare: (v: string, str: string, locale?: string, opt?: Intl.CollatorOptions): number => (
        v.localeCompare(str, locale, opt)
      ),

      /**
       * Returns the Unicode Normalization Form of this string
       *
       * @param value String value
       *
       * @returns {string}
       */
      normalize: (value: string): string => (
        value.normalize()
      ),

      /**
       * Returns a new string containing characters of the calling string from
       * (or between) the specified index (or indices)
       *
       * @param value String value
       * @param start Start index
       * @param end End index
       *
       * @returns {string}
       */
      substring: (value: string, start: number, end?: number): string => (
        value.substring(start, end)
      ),

      /**
       * Returns currently logged user's information
       *
       * @param name 'email' | 'firstname' | 'lastname' | 'locale'
       *
       * @returns {string|undefined}
       */
      user: (name: string): string | undefined => {
        if (['email', 'firstname', 'lastname', 'locale'].includes(name)) {
          return auth.user[name]
        }
        return undefined
      },

      /**
       * Returns currently logged user's setting key value
       *
       * @param name key name
       *
       * @returns {string|undefined}
       */
      setting: (name: string): string | undefined => (
        auth.user.settings[name]
      ),

      /**
       * Returns a unique id
       *
       * @returns {string}
       */
      uniqueId: (): string => (
        hexObjectId()
      ),

      /**
       * Returns the next sequential number from a string
       *
       * @param no Previous number
       *
       * @returns {string}
       */
      nextNo: (no: string): string => (
        next(no)
      ),

      /**
       * Returns a new array of objects by extracting specific keys from values
       *
       * @param array Array of objects
       * @param keys Array of keys or a single a key
       *
       * @returns {AnyData[]}
       */
      map: (array: AnyData[], keys: string[] | string): unknown[] => {
        if (typeof keys === 'string') {
          return array.map((val) => val[keys])
        }
        return array.map((val) => pick(val, keys))
      },

      /**
       * Returns the domain part of a Url or Email string
       *
       * @param urlOrEmail Url or email
       *
       * @return {string|undefined}
       */
      domain: (urlOrEmail: string): string | undefined => {
        // email
        const e = urlOrEmail
          .match(/(?<=@)[^.]+(?=\.).*/gm)
        if (e.length === 1) {
          return e[0]
        }
        // url
        const a = document.createElement('a')
        a.setAttribute('href', urlOrEmail)
        return a.hostname
      },

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

export const useExpression = (t: T18N) => {
  const variables = useVariables()

  const userTable = useFeathersService('tables')
    .findOneInStore({ query: {} })

  const userForm = useFeathersService('forms')
    .findOneInStore({ query: {} })

  const userMenu = useFeathersService('menus')
    .findOneInStore({ query: {} })

  const functions = computed((): Menu[] => (
    sortBy(categories.map((category) => ({
      icon: category.icon,
      name: category.name,
      label: category.label,
      children: sortBy(category.children.map((k) => ({
        icon: 'mdi-flash',
        name: k,
        label: k,
        value: `${k}()`,
        cursorAdj: -1,
        tooltip: fcts[k],
      })), 'label'),
    })), 'label')
  ))

  const tables = computed((): Menu[] => (
    sortBy((userTable.value?.list || []).map((table: TableSchema) => ({
      icon: 'mdi-table',
      name: table._id,
      label: table.name,
      value: `table('${table.name}')`,
    })), 'label')
  ))

  const fields = computed((): Menu[] => (
    sortBy(
      (userTable.value?.list || [])
        .filter((table: TableSchema) => table.fields.length > 0)
        .map((table: TableSchema) => ({
          icon: 'mdi-table',
          name: table._id,
          label: table.name,
          children: sortBy(table.fields.map((field: FieldSchema) => ({
            icon: iconForType(field.type),
            name: field._id,
            label: field.name,
            value: `field('${table.name}', '${field.name}')`,
          })), 'label'),
        })),
      'label',
    )
  ))

  const menus = computed((): Menu[] => (
    sortBy((userMenu.value?.list || []).map((menu: MenuSchema) => ({
      icon: 'mdi-menu',
      name: menu._id,
      label: menu.label,
      value: `menu('${menu.label}')`,
    })), 'label')
  ))

  const tabs = computed((): Menu[] => (
    sortBy(
      (userMenu.value?.list || [])
        .filter((menu: MenuSchema) => menu.tabs.length > 0)
        .map((menu: MenuSchema) => ({
          icon: 'mdi-menu',
          name: menu._id,
          label: menu.label,
          children: sortBy(menu.tabs.map((tab: TabSchema) => ({
            icon: 'mdi-tab',
            name: tab._id,
            label: tab.label,
            value: `tab('${menu.label}', '${tab.label}')`,
          })), 'label'),
        })),
      'label',
    )
  ))

  const forms = computed((): Menu[] => (
    sortBy((userForm.value?.list || []).map((form: FormSchema) => ({
      icon: 'mdi-window-maximize',
      name: form._id,
      label: form.name,
      value: `form('${form.name}')`,
    })), 'label')
  ))

  const vars = computed((): Menu[] => (
    sortBy(variables.names.map((v) => ({
      icon: 'mdi-variable',
      name: v,
      label: v,
      value: `var('${v}')`,
    })), 'label')
  ))

  const mainmenu = computed((): Menu[] => ([
    {
      icon: 'mdi-flash',
      name: 'functions',
      label: t('code_editor.menus.functions'),
      children: functions.value,
    },
    {
      icon: 'mdi-variable',
      name: 'variables',
      label: t('code_editor.menus.variables'),
      children: vars.value,
    },
    {
      icon: 'mdi-menu',
      name: 'menus',
      label: t('code_editor.menus.menus'),
      children: menus.value,
    },
    {
      icon: 'mdi-tab',
      name: 'tabs',
      label: t('code_editor.menus.tabs'),
      children: tabs.value,
    },
    {
      icon: 'mdi-window-maximize',
      name: 'forms',
      label: t('code_editor.menus.forms'),
      children: forms.value,
    },
    {
      icon: 'mdi-table',
      name: 'tables',
      label: t('code_editor.menus.tables'),
      children: tables.value,
    },
    {
      icon: 'mdi-form-textbox',
      name: 'fields',
      label: t('code_editor.menus.fields'),
      children: fields.value,
    },
  ]))

  const dropmenu = computed((): Menu[] => ([
    {
      icon: 'mdi-flash-triangle',
      name: 'quickies',
      label: t('code_editor.menus.quickies'),
      children: [
        {
          icon: 'mdi-variable-box',
          name: 'result',
          label: t('code_editor.menus.result'),
          value: '$result()',
        },
        {
          icon: 'mdi-code-json',
          name: 'doc',
          label: t('code_editor.menus.doc'),
          value: 'doc()',
        },
        {
          icon: 'mdi-menu',
          name: 'menuId',
          label: t('code_editor.menus.menuId'),
          value: 'menuId()',
        },
        {
          icon: 'mdi-tab',
          name: 'tabId',
          label: t('code_editor.menus.tabId'),
          value: 'tabId()',
        },
        {
          icon: 'mdi-window-maximize',
          name: 'formId',
          label: t('code_editor.menus.formId'),
          value: 'formId()',
        },
        {
          icon: 'mdi-table',
          name: 'tableId',
          label: t('code_editor.menus.tableId'),
          value: 'tableId()',
        },
      ],
    },
    {
      icon: 'mdi-variable',
      name: 'variables',
      label: t('code_editor.menus.variables'),
      children: vars.value,
    },
    {
      icon: 'mdi-menu',
      name: 'menus',
      label: t('code_editor.menus.menus'),
      children: menus.value,
    },
    {
      icon: 'mdi-tab',
      name: 'tabs',
      label: t('code_editor.menus.tabs'),
      children: tabs.value,
    },
    {
      icon: 'mdi-window-maximize',
      name: 'forms',
      label: t('code_editor.menus.forms'),
      children: forms.value,
    },
    {
      icon: 'mdi-table',
      name: 'tables',
      label: t('code_editor.menus.tables'),
      children: tables.value,
    },
    {
      icon: 'mdi-form-textbox',
      name: 'fields',
      label: t('code_editor.menus.fields'),
      children: fields.value,
    },
  ]))

  return {
    isExpr,
    exprCode,
    exprToString,
    stringToExpr,
    runExpr,
    getProp,
    buildCtx,
    mainmenu,
    dropmenu,
  }
}
