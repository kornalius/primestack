import { Type, StringEnum } from '@feathersjs/typebox'
import { actionIcon, contentIcon } from '../icons'
import ExType from '../extypes'
import { hexObjectId } from '../schema'
// eslint-disable-next-line import/no-cycle
import { newNameForVariable } from '../menu'

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
    color: Type.Optional(ExType.Color({ quasarPalette: true })),
    formId: ExType.Id({ service: 'forms' }),
    badgeTableId: Type.Optional(ExType.Table()),
    badgeFilter: Type.Optional(ExType.Query({ tableProp: 'badgeTableId' })),
    badgeField: Type.Optional(ExType.Field({ tableProp: 'badgeTableId' })),
    badgeGroupFields: Type.Optional(Type.Array(
      ExType.Field({ tableProp: '../badgeTableId' }),
    )),
    badgeStat: Type.Optional(StringEnum(badgetStats)),
    click: Type.Optional(ExType.Action()),
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
      action: {
        icon: actionIcon,
        names: [
          'click',
        ],
      },
    },
    eventArgs: {
      click: () => ({}),
    },
  },
)

export const variableSchema = Type.Object(
  {
    _id: ExType.Id(),
    name: Type.String(),
    value: Type.Optional(Type.Union([Type.String(), Type.Number(), Type.Boolean()])),
  },
  {
    $id: 'Variable',
    additionalProperties: false,
    horizontal: true,
    horizontalPopup: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newValue: (arr: any[]) => ({
      _id: hexObjectId(),
      name: newNameForVariable(arr),
      value: undefined,
    }),
    showName: true,
    renameable: true,
    names: [
      'value',
    ],
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
    variables: Type.Array(variableSchema),
    click: Type.Optional(ExType.Action()),
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
          'variables',
        ],
      },
      action: {
        icon: actionIcon,
        names: [
          'click',
        ],
      },
    },
    eventArgs: {
      click: () => ({}),
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
