import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

const checkMaxMenus = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxMenus
  if (m !== -1 && context.data?.list.length >= m) {
    throw new Forbidden(
      `Your plan only supports ${m} menus, please consider upgrading`
    )
  }
  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxMenus,
    ],
    update: [
      checkMaxMenus,
    ],
    patch: [
      checkMaxMenus,
    ],
  },
}
