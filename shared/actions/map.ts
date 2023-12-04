import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'map',
  label: 'actions.map.label',
  schema: Type.Object({
    value: ExType.JSON(),
    expr: ExType.Expr(),
  }),
} as TAction
