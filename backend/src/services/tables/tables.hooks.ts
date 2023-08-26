import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

export const checkMaxTables = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { count } = await context.app.service('tables').find({ query: { $limit: 0 } })
  const m = context.params?.user?.rights?.maxes?.maxTables
  if (m !== -1 && count >= m) {
    throw new Forbidden(
      `Your plan only supports ${m} tables, please consider upgrading`
    )
  }
  return context
}

export const checkMaxRecords = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { count } = await context.app.service(context.path).find({ query: { $limit: 0 } })
  const m = context.params?.user?.rights?.maxes?.maxRecords
  if (m !== -1 && count >= m) {
    throw new Forbidden(
      `Your plan only supports ${m} records per table, please consider upgrading`
    )
  }
  return context
}
