import { TFrontAction } from '@/features/Actions/interface'
import globalFetch from '@/shared/actions/fetch'
import Fetch from '../components/fetch.vue'

export default {
  ...globalFetch,
  icon: 'mdi-file-download',
  color: 'orange-3',
  component: Fetch,
  description: 'actions.fetch.description',
  childrenMessage: 'actions.fetch.childrenMessage',
  exec: async (args) => {
    const options = {
      method: args.method as string,
      credentials: args.credentials as RequestCredentials || undefined,
      cache: args.cache as RequestCache || undefined,
      redirect: args.redirect as RequestRedirect || undefined,
      headers: (args.headers as Array<{ key: string, value: string }>)
        .map((kv) => ([kv.key, kv.value])) as HeadersInit,
      body: args.body ? JSON.stringify(args.body) : undefined,
      referer: args.referer as string || undefined,
      refererPolicy: args.refererPolicy as ReferrerPolicy,
      mode: args.mode as RequestMode || undefined,
      priority: args.priority as ReferrerPolicy || undefined,
      target: args.target as string || undefined,
    }
    const response = await fetch(args.href as string, options)
    if (response.ok && response.body) {
      const json = await response.json()
      if (args.target) {
        args.variables.set(args.target as string, json)
      }
      return json
    }
    return undefined
  },
  result: (): string[] => ([]),
} as TFrontAction
