import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'interval',
  label: 'actions.interval.label',
  schema: Type.Object({
    milliseconds: Type.Number(),
    varName: ExType.Variable(),
  }),
  acceptsChildren: true,
} as TAction
