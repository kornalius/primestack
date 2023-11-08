import { StringEnum, Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'notify',
  label: 'actions.notify.label',
  schema: Type.Object({
    level: StringEnum(['Success', 'Error', 'Info', 'Warning']),
    message: Type.String(),
  }),
  defaultValues: {
    level: 'Info',
  },
} as TAction
