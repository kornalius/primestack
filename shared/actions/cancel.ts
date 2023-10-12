import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'cancel',
  label: 'Cancel',
  schema: Type.Object({
    varName: ExType.Variable(),
  }),
} as TAction
