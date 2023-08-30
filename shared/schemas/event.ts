import { Type } from '@feathersjs/typebox'

export const schema = Type.Object({
  _id: Type.String({ objectid: true }),
  // current user id who performs the action
  userId: Type.Optional(Type.String({ objectid: true })),
  // owner of the custom table the action is performed on
  ownerId: Type.Optional(Type.String({ objectid: true })),
  // action type ('find', 'get', 'create', 'update', 'patch', 'remove')
  method: Type.String(),
  // service name
  service: Type.String(),
  // document id the action is performed on
  docId: Type.Optional(Type.String({ objectid: true })),
  // timestamp
  time: Type.Number(),
  // query from the params
  query: Type.Optional(Type.Object({})),
  // data being passed
  data: Type.Optional(Type.Object({})),
}, { $id: 'Event', additionalProperties: false })
