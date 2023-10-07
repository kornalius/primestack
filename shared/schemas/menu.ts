import { Type, StringEnum } from '@feathersjs/typebox'
import { contentIcon } from '../icons'
import ExType from '../extypes'

export const targetValues = ['_blank', '_self', '_parent', '_top']

export const badgetStats = [
  'count',
  'avg',
  'sum',
  'min',
  'max',
  'empty',
  '!empty',
  '%empty',
  '%!empty',
]

export const tabSchema = Type.Object(
  {
    _id: ExType.Id(),
    label: Type.String(),
    description: Type.Optional(Type.String()),
    icon: ExType.Icon(),
    color: Type.Optional(ExType.Color()),
    formId: ExType.Id({ service: 'forms' }),
    badgeTableId: Type.Optional(ExType.Table()),
    badgeFilter: Type.Optional(ExType.Query({ tableProp: 'badgeTableId' })),
    badgeField: Type.Optional(ExType.Field({ tableProp: 'badgeTableId' })),
    badgeGroupFields: Type.Optional(Type.Array(ExType.Field({ tableProp: '../badgeTableId' }))),
    badgeStat: Type.Optional(StringEnum(badgetStats)),
  },
  {
    $id: 'Tab',
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'label',
          'description',
          'icon',
          'color',
          'badgeTableId',
          'badgeFilter',
          'badgeField',
          'badgeStat',
          'badgeGroupFields',
        ],
      },
    },
  },
)

export const menuSchema = Type.Object(
  {
    _id: ExType.Id(),
    label: Type.String(),
    description: Type.Optional(Type.String()),
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
          'description',
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
