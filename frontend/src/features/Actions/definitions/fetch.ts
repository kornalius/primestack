// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalFetch from '@/shared/actions/fetch'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Fetch from '../components/fetch.vue'

export default {
  ...globalFetch,
  icon: 'mdi-file-download',
  color: 'orange-3',
  component: Fetch,
  description: 'actions.fetch.description',
  childrenMessage: 'actions.fetch.childrenMessage',
  exec: async (ctx) => {
    const method = anyToString(getProp(ctx.method, ctx)) || undefined
    const credentials = (anyToString(getProp(ctx.credentials, ctx)) || undefined) as RequestCredentials
    const cache = (anyToString(getProp(ctx.cache, ctx)) || undefined) as RequestCache
    const redirect = (anyToString(getProp(ctx.redirect, ctx)) || undefined) as RequestRedirect
    const referrer = (anyToString(getProp(ctx.referrer, ctx)) || undefined)
    const referrerPolicy = (anyToString(getProp(ctx.referrerPolicy, ctx)) || undefined) as ReferrerPolicy
    const mode = (anyToString(getProp(ctx.mode, ctx)) || undefined) as RequestMode
    const target = anyToString(getProp(ctx.target, ctx))
    const href = anyToString(getProp(ctx.href, ctx))
    const body = getProp(ctx.body, ctx)

    const response = await fetch(href, {
      method,
      credentials,
      cache,
      redirect,
      headers: (ctx.headers as Array<{ key: string, value: string }>)
        .map((kv) => ([kv.key, kv.value])) as HeadersInit,
      body: body ? JSON.stringify(body) : undefined,
      referrer,
      referrerPolicy,
      mode,
    })
    if (response.ok && response.body) {
      const json = await response.json()
      if (target) {
        ctx.variables.set(target, json)
      }
      return json
    }
    return undefined
  },
  result: (): string[] => ([]),
} as TFrontAction
