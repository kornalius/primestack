import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'unsetvar',
  label: 'Unset Variable',
  description: 'Unset a variable',
  schema: Type.Object({
    name: Type.String({ variable: true }),
  }),
} as TAction
