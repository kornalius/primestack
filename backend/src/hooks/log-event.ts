import type { HookContext } from '@/declarations'
import { isServiceAvailable } from '@/shared/plan'
import { AnyData } from '@/shared/interfaces/commons'

const servicesToSkip = [
  'events',
  'authentication',
]

export const mongoId = /^[a-f\d]{24}$/gi

/**
 * Log the service call to the events service
 */
export const logEvent = () => async (context: HookContext) => {
  const { user } = context.params

  if (
    // eslint-disable-next-line no-underscore-dangle
    isServiceAvailable('events', user?._plan?.code)
    && !servicesToSkip.includes(context.service)
  ) {
    let ownerId = user?._id.toString()

    // custom table
    if (context.path.match(mongoId)) {
      const tables = await context.app.service('tables').find()
      const userTables = tables.data?.[0]?.list || []
      const table = userTables.find((t: AnyData) => t._id.toString() === context.path)
      if (table) {
        ownerId = tables.data[0].createdBy?.toString()
      }
    }

    await context.app.service('events').create({
      userId: user?._id.toString(),
      ownerId,
      method: context.method,
      service: context.path,
      docId: context.id?.toString(),
      time: Date.now(),
      query: context.params?.query,
      data: context.data,
    })
  }

  return context
}
