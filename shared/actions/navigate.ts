import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'navigate',
  label: 'Navigate',
  schema: Type.Object({
    url: Type.String(),
  }),
  defaultValues: {
    target: '_self',
  },
} as TAction
