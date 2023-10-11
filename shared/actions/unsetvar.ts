import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'unsetvar',
  label: 'Unset Variable',
  schema: Type.Object({
    name: Type.String({ variable: true }),
  }),
} as TAction
