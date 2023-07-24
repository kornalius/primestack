import { Type } from '@feathersjs/typebox'
import { contentIcon } from '../icons'

export const columnSchema = Type.Recursive((self) => Type.Object(
  {
    _id: Type.String({ objectid: true }),
    _type: Type.String(),
    size: Type.Optional(Type.Number()),
    _fields: Type.Array(Type.Object(
      {
        _id: Type.String({ objectid: true }),
        _type: Type.String(),
        name: Type.String(),
        _columns: Type.Optional(Type.Array(self)),
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
    _columns: Type.Optional(Type.Array(columnSchema)),
  },
  { additionalProperties: true },
)

export const formSchema = Type.Object(
  {
    name: Type.String(),
    tableId: Type.Optional(Type.String({ objectid: true, tableid: true })),
    data: Type.Optional(Type.Object({}, { json: true })),
    _fields: Type.Array(fieldSchema),
  },
  {
    additionalProperties: true,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'name',
          'tableId',
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
