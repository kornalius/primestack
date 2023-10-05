import { HookContext, Params, RealTimeConnection } from '@feathersjs/feathers'
import { AuthenticationResult } from '@feathersjs/authentication'
import { Static } from '@feathersjs/typebox'
import { mongoId } from '@/hooks/log-event'
import { schema as shareSchema } from '@/shared/schemas/share'
import { schema as tableSchema } from '@/shared/schemas/table'
import { Application } from './declarations'

type Share = Static<typeof shareSchema>
type TableSchema = Static<typeof tableSchema>

export default function (app: Application): void {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return
  }

  app.on('connection', (connection: RealTimeConnection): void => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult: AuthenticationResult, { user, connection }: Params) => {
    // connection can be undefined if there is no real-time, e.g. when logging in via REST
    if (connection) {
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection)

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection)

      // Add it to own specific user channel
      app.channel(`users/${user?._id}`).join(connection)

      // Add it to the stats channel
      app.channel('stats').join(connection)
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  app.service('stats').publish('calculate', (data: any, context: HookContext) => {
    return [app.channel('stats')]
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  app.publish(async (data: any, context: HookContext) => {
    const userId = context?.params?.user?._id
    if (userId) {
      // service is a user's table
      if (mongoId.test(context.path)) {
        // retrieve all menus shared with the user
        const userShares = (await context.app.service('shares').find({
          query: {
            userId,
          },
        })).data as Share[]

        const userTables = (await context.app.service('tables').find({
          query: {
            tableIds: { $in: [context.path] }
          },
        }, context.params)).data as TableSchema[]

        const share = userShares.find((s: Share) => (
          s.tableIds?.includes(context.path)
        ))

        // so if this table is shared with the user or he/she is the creator of the table
        if (share || userTables.length) {
          // only publish to the same channel linked to the current user id
          return [app.channel(`users/${userId}`)]
        }

        return []
      }
    }

    return [app.channel('authenticated')]
  })

  // Here you can add event publishers to channels set up in `channels.ts`
  // To publish only for a specific event use `app.publish(eventname, () => {})`

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'))

  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // })
}
