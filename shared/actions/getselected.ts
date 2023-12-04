import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'getselected',
  label: 'actions.getselected.label',
  schema: Type.Object({}),
} as TAction
