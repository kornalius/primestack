import '@feathersjs/transport-commons'
import { HookContext } from '@feathersjs/feathers'
import { Application } from './declarations'

export default function (app: Application): void {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.on('connection', (connection: any): void => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app.on('login', (authResult: any, { connection }: any): void => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      // const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection)

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection)

      // Add it to that specific appId channel
      // app.channel(`appIds/${connection.appId}`).join(connection);

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(connection));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(connection);
      // app.channel(`userIds/${user.id}`).join(connection);
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  app.publish((data: any, hook: HookContext) => [app.channel('authenticated')])
  // {
  // eslint-disable-next-line max-len
  // console.log('Publishing all events to all authenticated users. See `channels.ts` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line
  //
  // const appId = hook?.params?.connection?.appId;
  //
  // if there is an appId provided
  // if (appId) {
  //   if (hook.path === 'refreshes' && hook.method === 'create') {
  //     // send the update to channels that are not linked to the current appId
  //     const names = app.channels
  //       .filter((name) => !['authenticated', `appIds/${appId}`].includes(name));
  //     return names
  //       .map((name) => app.channel(name));
  //   }
  //
  //   // only publish to the same channel linked to the current appId
  //   return [app.channel(`appIds/${appId}`)];
  // }
  //
  //   return [app.channel('authenticated')]
  // })

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
