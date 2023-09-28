import { passwordHash } from '@feathersjs/authentication-local'
import { virtual } from '@feathersjs/schema'
import { HookContext } from '@feathersjs/feathers'
import { AnyData } from '@/shared/interfaces/commons'

export default {
  external: {
    password: async () => undefined
  },
  data: {
    $create: {
      password: passwordHash({ strategy: 'local' })
    },
    $patch: {
      password: passwordHash({ strategy: 'local' })
    },
  },
  result: {
    _plan: virtual(async (record: AnyData, context: HookContext) => {
      if (record.planId) {
        // Populate the plan associated
        return context.app.service('plans').get(record.planId)
      }
      return undefined
    }),

    _group: virtual(async (record: AnyData, context: HookContext) => {
      if (record.groupId) {
        // Populate the plan associated
        return context.app.service('groups').get(record.groupId)
      }
      return undefined
    }),
  },
  query: {
    _id: async (value: AnyData, user: AnyData, context: HookContext) => {
      if (context.params.user) {
        return context.params.user._id
      }
      return value
    }
  }
}
