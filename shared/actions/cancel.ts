import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'cancel',
  label: 'actions.cancel.label',
  schema: Type.Object({
    varName: ExType.Variable(),
  }),
} as TAction
