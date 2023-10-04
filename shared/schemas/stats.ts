import { StringEnum, Type } from '@feathersjs/typebox'
import ExType from '../extypes'

export const schema = Type.Object(
  {
    _id: ExType.Id(),
    uuid: Type.String(),
    path: Type.Optional(Type.String()),
    field: Type.Optional(Type.String()),
    type: Type.Optional(
      StringEnum([
        'count',
        'sum',
        'avg',
        'min',
        'max',
        'empty',
        '!empty',
        '%empty',
        '%!empty',
      ])
    ),
    groupFields: Type.Optional(Type.Array(Type.String())),
    value: Type.Optional(Type.Number()),
    query: Type.Optional(Type.Object({}, { additionalProperties: true })),
  },
  { $id: 'Stats', additionalProperties: false },
)
