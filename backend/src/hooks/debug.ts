import { NextFunction } from '@feathersjs/feathers'
import { HookContext } from '@/declarations'
import { info } from '@/logger'

export const debug = async (context: HookContext, next: NextFunction) => {
  // internal calls
  if (context.params.provider === undefined) {
    await next()
    return
  }

  const startTime = Date.now()

  const {
    method,
    path,
    params,
    data,
  } = context

  const sizeof = (o: unknown): number => JSON.stringify(o).length

  const prefix = `${params.ip} ${method.toUpperCase()} /${path}`

  info(`${prefix} QUERY ${sizeof(params.query)} ${JSON.stringify(params.query)}`)

  if (data) {
    info(`${prefix} DATA ${sizeof(data)} ${JSON.stringify(data)}`)
  }

  await next()

  info(`${prefix} RESULT ${sizeof(context.result)} ${JSON.stringify(context.result)}`)

  info(`${prefix} ${Date.now() - startTime}ms`)
}
