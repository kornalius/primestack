import { StringEnum, Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'notify',
  label: 'Notify',
  description: 'Display a notification bar',
  icon: (value?) => {
    switch (value?.level || '') {
      case 'Info': return 'mdi-information'
      case 'Error': return 'mdi-alert-circle'
      case 'Warning': return 'mdi-alert-circle'
      case 'Success': return 'mdi-check-circle'
      default: return 'mdi-message'
    }
  },
  iconColor: (value?) => {
    switch (value?.level || '') {
      case 'Info': return 'info'
      case 'Error': return 'negative'
      case 'Warning': return 'warning'
      case 'Success': return 'positive'
      default: return 'green-4'
    }
  },
  color: 'green-4',
  schema: Type.Object({
    level: StringEnum(['Success', 'Error', 'Info', 'Warning']),
    message: Type.String(),
  }),
  defaultValues: {
    level: 'Info',
  },
} as TAction
