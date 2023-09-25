import { Type, StringEnum } from '@feathersjs/typebox'
import { contentIcon } from '../icons'
import ExType from '../extypes'

export const targetValues = ['_blank', '_self', '_parent', '_top']

export const tabSchema = Type.Object(
  {
    _id: ExType.Id(),
    label: Type.String(),
    icon: ExType.Icon(),
    color: Type.Optional(ExType.Color()),
    formId: ExType.Id({ service: 'forms' }),
  },
  {
    $id: 'Tab',
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'label',
          'icon',
          'color',
        ],
      },
    },
  },
)

export const menuSchema = Type.Object(
  {
    _id: ExType.Id(),
    label: Type.String(),
    icon: ExType.Icon(),
    color: Type.Optional(ExType.Color()),
    href: Type.Optional(Type.String()),
    target: Type.Optional(StringEnum(targetValues)),
    tabs: Type.Array(tabSchema),
  },
  {
    $id: 'Menu',
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
  },
)

export const schema = Type.Object(
  {
    _id: ExType.Id(),
    userId: Type.Optional(ExType.Id()),
    list: Type.Array(menuSchema),
    // from resolvers
    menuIds: Type.Optional(Type.Array(ExType.Id())),
    formIds: Type.Optional(Type.Array(ExType.Id())),
    tableIds: Type.Optional(Type.Array(ExType.Id())),
    userIds: Type.Optional(Type.Array(ExType.Id())),
  },
  { $id: 'MenuList', additionalProperties: false },
)
