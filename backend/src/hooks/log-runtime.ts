import { NextFunction } from '@feathersjs/feathers'
import { HookContext } from '@/declarations'
import { info } from '@/logger'

/**
 * Log service call runtime
 */
export const logRuntime = () => async (context: HookContext, next: NextFunction) => {
  const startTime = Date.now()

  await next()

  info(
    `Method ${context.method} on ${context.path} took ${Date.now() - startTime}ms`
  )
}
