import { LRUCache } from 'lru-cache'
import { printf } from 'fast-printf'
import expr2fn from 'kornalius-expr2fn'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useFeathers } from '@/composites/feathers'
import { useSnacks } from '@/features/Snacks/store'
import { useVariables } from '@/features/Variables/store'
import { LocationQueryValue, useRoute, useRouter } from 'vue-router'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/App/store'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exec } from '@/features/Actions/composites'

export const isExpr = (v: unknown): boolean => typeof v === 'string' && v.startsWith('```') && v.endsWith('```')

export const exprCode = (v: string): string => (isExpr(v) ? v.substring(3, v.length - 3) : undefined)

export const exprToString = (v: string): string => (isExpr(v) ? v.substring(3, v.length - 3) : v)

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
  isExpr(v) ? runExpr(exprCode(v as string), ctx.expr) : v
)

export const buildCtx = (extra?: AnyData): ((ctx?: AnyData) => AnyData) => {
  const { t } = useI18n()
  const quasar = useQuasar()
  const { api } = useFeathers()
  const snacks = useSnacks()
  const store = useVariables()
  const route = useRoute()
  const router = useRouter()
  const editor = useAppEditor()
  const vars = useVariables()

  return (doc) => ({
    quasar,
    snacks,
    api,
    editor,
    t,
    store,
    route,
    router,
    exec,
    ...(extra || {}),
    expr: {
      /**
       * Get or set a variable's value
       *
       * @param name Name of the variable
       * @param value Optional value
       *
       * @returns {unknown | undefined} Value of the variable
       */
      var: (name: string, value?: unknown): unknown | undefined => {
        if (vars.variableExists(name)) {
          if (value) {
            vars.setVariable(name, value)
          }
          return vars.getVariable(name) as string
        }
        return undefined
      },

      /**
       * Get the table id by its name
       *
       * @param name Table name
       *
       * @returns {string | undefined} Id of the table
       */
      table: (name: string): string | undefined => {
        const tables = api.service('tables').findInStore()
        const userTables = tables.value?.[0]?.list || []
        const table = userTables.find((tt: AnyData) => tt.name === name)
        if (table) {
          return table._id
        }
        return undefined
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
        const tables = api.service('tables').findInStore()
        const userTables = tables.value?.[0]?.list || []
        const table = userTables.find((tt: AnyData) => tt.name === tablename)
        if (table) {
          return table.fields.find((ff: AnyData) => ff.name === fieldname)?._id
        }
        return undefined
      },

      /**
       * Get or set the current document field
       *
       * @param fieldname Field name
       * @param value Optional value
       *
       * @returns {unknown} Value of the field
       */
      doc: (fieldname: string, value?: unknown): unknown | undefined => {
        if (!doc) {
          return undefined
        }
        if (value) {
          // eslint-disable-next-line no-param-reassign
          doc[fieldname] = value
        }
        return doc[fieldname]
      },

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
       * Get or set a url parameter
       *
       * @param name Parameter name
       * @param value Optional value to set it to
       *
       * @return {LocationQueryValue | LocationQueryValue[]} Url parameter value
       */
      param: (name: string, value?: LocationQueryValue): LocationQueryValue | LocationQueryValue[] => {
        if (value) {
          route.query[name] = value
        }
        return route.query[name]
      },
    },
  })
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
