import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'if',
  label: 'If',
  schema: Type.Object({
    expr: ExType.Expr(),
  }),
  acceptsChildren: true,
} as TAction
