import { Type} from '@feathersjs/typebox'

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    version: Type.String(),
    uptime: Type.Number(),
    calls: Type.Object({
      total: Type.Number(),
      find: Type.Number(),
      get: Type.Number(),
      create: Type.Number(),
      update: Type.Number(),
      patch: Type.Number(),
      remove: Type.Number(),
    }),
  },
  { $id: 'Health', additionalProperties: false }
)
