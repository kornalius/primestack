import { Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon } from '../icons'

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
  { additionalProperties: true },
))

export const fieldSchema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    _type: Type.String(),
    name: Type.String(),
    columns: Type.Optional(Type.Array(columnSchema)),
  },
  { additionalProperties: true },
)

export const formSchema = Type.Object(
  {
    name: Type.String(),
    schemaId: Type.Optional(Type.String({ objectid: true, service: 'schemas' })),
    data: Type.Optional(Type.Object({}, { json: true })),
    fields: Type.Array(fieldSchema),
  },
  {
    additionalProperties: true,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'name',
        ],
      },
      model: {
        icon: modelIcon,
        names: [
          'schemaId',
          'data',
        ],
      },
    },
  },
)

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    userId: Type.Optional(Type.String({ objectid: true })),
    list: Type.Array(formSchema),
  },
  { $id: 'Form', additionalProperties: false },
)
