import { Type, StringEnum} from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '../icons'

export const targetValues = ['_blank', '_self', '_parent', '_top']

export const tabSchema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    label: Type.String(),
    icon: Type.String({ icon: true }),
    color: Type.Optional(Type.String({ color: true })),
    formId: Type.String({ objectid: true, service: 'forms' }),
  },
  {
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'label',
          'icon',
        ],
      },
      model: {
        icon: modelIcon,
        names: [
          'formId',
        ],
      },
      style: {
        icon: styleIcon,
        names: [
          'color',
        ]
      }
    },
  },
)

export const menuSchema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    label: Type.String(),
    icon: Type.String({ icon: true }),
    color: Type.Optional(Type.String( { color: true })),
    href: Type.Optional(Type.String()),
    target: Type.Optional(StringEnum(targetValues)),
    tabs: Type.Array(tabSchema),
  },
  {
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'label',
          'icon',
          'href',
          'target',
        ],
      },
    },
  }
)

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    userId: Type.Optional(Type.String({ objectid: true })),
    list: Type.Array(menuSchema),
  },
  { $id: 'Menu', additionalProperties: false },
)
