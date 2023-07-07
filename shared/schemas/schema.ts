import { Type, StringEnum} from '@feathersjs/typebox'

export const supportedFieldTypes = ['string', 'number', 'boolean']

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    methods: Type.Array(Type.String()),
    created: Type.Boolean(),
    updated: Type.Boolean(),
    softDelete: Type.Boolean(),
    user: Type.Boolean(),
    fields: Type.Array(Type.Object(
      {
        name: Type.String({ availableFieldname: true }),
        type: StringEnum(supportedFieldTypes),
        hidden: Type.Boolean(),
        array: Type.Boolean(),
        optional: Type.Boolean(),
        readonly: Type.Boolean(),
        queryable: Type.Boolean(),
      },
      { additionalProperties: false }
    )),
    indexes: Type.Array(Type.Object(
      {
        name: Type.String({ availableFieldname: true }),
        order: Type.Number({ minimum: -1, maximum: 1 }),
        unique: Type.Boolean(),
        sparse: Type.Boolean(),
      },
      { additionalProperties: false }
    )),
  },
  { $id: 'Schema', additionalProperties: false }
)
