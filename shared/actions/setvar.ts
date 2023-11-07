import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'setvar',
  label: 'Set Variable',
  schema: Type.Object({
    name: ExType.Variable(),
    value: Type.String(),
  }),
} as TAction
