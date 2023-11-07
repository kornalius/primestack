// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import type { HookContext, NextFunction } from '@/declarations'
import { error as err } from '@/logger'

/**
 * Logs the error to the logger
 */
export const logError = () => async (context: HookContext, next: NextFunction) => {
  try {
    await next()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    err(error.stack)

    // Log validation errors
    if (error.data) {
      err(`Data: ${JSON.stringify(error.data, undefined, 2)}`)
    }

    throw error
  }
}
