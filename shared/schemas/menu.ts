import { Type, StringEnum} from '@feathersjs/typebox'

export const targetValues = ['_blank', '_self', '_parent', '_top']

export const tabSchema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    label: Type.String(),
    icon: Type.String(),
    color: Type.Optional(Type.String()),
    formId: Type.String({ objectid: true }),
  },
  { additionalProperties: false },
)

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    label: Type.String(),
    icon: Type.String(),
    color: Type.Optional(Type.String()),
    href: Type.Optional(Type.String()),
    target: Type.Optional(StringEnum(targetValues)),
    tabs: Type.Array(tabSchema),
  },
  { $id: 'Menu', additionalProperties: false },
)
