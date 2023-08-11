import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'navigate',
  label: 'Navigate',
  description: 'Navigate to another browser location',
  schema: Type.Object({
    url: Type.String(),
  }),
  defaultValues: {
    target: '_self',
  },
} as TAction
