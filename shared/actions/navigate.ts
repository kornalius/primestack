import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'navigate',
  label: 'Navigate',
  schema: Type.Object({
    menuId: ExType.Menu(),
    tabId: ExType.Tab(),
    href: Type.String(),
  }),
  defaultValues: {
    target: '_self',
  },
} as TAction
