import { Type } from '@feathersjs/typebox'
import ExType from '../extypes'

export const schema = Type.Object(
  {
    _id: ExType.Id(),
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
  { $id: 'Health', additionalProperties: false },
)
