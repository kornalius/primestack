import { HookContext } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'

export default {
  query: {
    ownerId: async (value: AnyData, context: HookContext) => {
      if (context.params?.user) {
        return context.params.user._id
      }
      return value
    },
  },
}
