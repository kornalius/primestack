import { Type } from '@feathersjs/typebox'

export const columnSchema = Type.Recursive((self) => Type.Object(
  {
    _id: Type.String({ objectid: true }),
    _type: Type.String(),
    size: Type.Optional(Type.Number()),
    fields: Type.Array(Type.Object(
      {
        _id: Type.String({ objectid: true }),
        _type: Type.String(),
        name: Type.String(),
        columns: Type.Optional(Type.Array(self)),
      },
      { additionalProperties: true },
    )),
  },
  { $id: 'Column', additionalProperties: true },
))

export const fieldSchema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    _type: Type.String(),
    name: Type.String(),
    columns: Type.Optional(Type.Array(columnSchema)),
  },
  { $id: 'Field', additionalProperties: true },
)

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    schemaId: Type.Optional(Type.String({ objectid: true })),
    data: Type.Optional(Type.String()),
    fields: Type.Array(fieldSchema),
  },
  { $id: 'Form', additionalProperties: false },
)
