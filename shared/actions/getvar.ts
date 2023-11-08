import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'getvar',
  label: 'actions.getvar.label',
  schema: Type.Object({
    name: ExType.Variable(),
  }),
} as TAction
