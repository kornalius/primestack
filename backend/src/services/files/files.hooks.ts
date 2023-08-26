import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { formatSize } from '@/shared/files/utils'

export const checkMaxFiles = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { count } = await context.app.service(context.path).find({ query: { $limit: 0 } })
  const m = context.params?.user?.rights?.maxes?.maxFiles
  if (m !== -1 && count >= m) {
    throw new Forbidden(
      `Your plan only supports a total of ${m} file(s), please consider upgrading`
    )
  }
  return context
}

export const checkMaxFileSize = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxFileSize
  if (m !== -1 && context.data.size >= m) {
    throw new Forbidden(
      `Your plan only supports file sizes up to ${formatSize(m)}, please consider upgrading`
    )
  }
  return context
}
