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

  info(`Query[${method}.${path}] ${JSON.stringify(params.query, undefined, 2)}`)

  if (data) {
    info(`Data[${method}.${path}] ${JSON.stringify(data, undefined, 2)}`)
  }

  await next()

  info(`Result[${method}.${path}] ${JSON.stringify(context.result, undefined, 2)}`)

  info(`Time[${method}.${path}] ${Date.now() - startTime}ms`)
}
