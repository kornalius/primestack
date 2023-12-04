import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'download',
  label: 'actions.download.label',
  schema: Type.Object({
    href: Type.String(),
  }),
  defaultValues: {
  },
} as TAction
