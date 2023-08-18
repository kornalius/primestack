import { Type } from '@feathersjs/typebox'

export const schema = Type.Intersect([
  Type.Object({
    _id: Type.String({ objectid: true }),
    originalFilename: Type.String(),
    newFilename: Type.String(),
    filepath: Type.String(),
    mimetype: Type.String(),
    size: Type.Integer(),
    state: Type.Optional(Type.Integer()),
    progress: Type.Optional(Type.Integer()),
    error: Type.Optional(Type.String()),
    data: Type.Optional(Type.String()),
  }),
], { $id: 'File', additionalProperties: false })
