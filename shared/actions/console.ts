import { StringEnum, Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'console',
  label: 'Console',
  schema: Type.Object({
    type: StringEnum(['log', 'info', 'warn', 'error']),
    message: Type.String(),
  }),
} as TAction
