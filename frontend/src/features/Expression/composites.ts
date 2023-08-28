import { LRUCache } from 'lru-cache'
import expr2fn from 'expr2fn'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useFeathers } from '@/composites/feathers'
import { useSnacks } from '@/features/Snacks/store'
import { useVariables } from '@/features/Variables/store'
import { useRoute, useRouter } from 'vue-router'
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
    fn = expr2fn(v) as (ctx: AnyData) => unknown
    cache.set(v, fn)
  }
  return fn({
    ...ctx,
    var: (name: string): unknown => ctx.store.getVariable(name),
    route: (): string => ctx.route.path,
  })
}

export const getProp = (v: unknown, ctx: AnyData): unknown => (
  isExpr(v) ? runExpr(exprCode(v as string), ctx) : v
)

export const buildCtx = (doc?: AnyData): AnyData => {
  const { t } = useI18n()
  const quasar = useQuasar()
  const { api } = useFeathers()
  const snacks = useSnacks()
  const store = useVariables()
  const route = useRoute()
  const router = useRouter()
  const editor = useAppEditor()

  return {
    quasar,
    snacks,
    api,
    editor,
    t,
    store,
    route,
    router,
    exec,
    doc,
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
