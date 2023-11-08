import { StringEnum, Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'console',
  label: 'actions.console.label',
  schema: Type.Object({
    type: StringEnum(['log', 'info', 'warn', 'error']),
    message: Type.String(),
  }),
} as TAction
