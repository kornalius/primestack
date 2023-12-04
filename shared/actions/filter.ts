import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'filter',
  label: 'actions.filter.label',
  schema: Type.Object({
    value: ExType.JSON(),
    expr: ExType.Expr(),
  }),
  defaultValues: {
    value: [],
  },
} as TAction
