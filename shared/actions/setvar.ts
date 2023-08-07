import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'setvar',
  label: 'Set Variable',
  description: 'Set a value to a variable',
  schema: Type.Object({
    name: Type.String({ variable: true }),
    value: Type.String(),
  }),
} as TAction
