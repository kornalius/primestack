import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'loop',
  label: 'actions.loop.label',
  schema: Type.Object({
    expr: ExType.Expr(),
  }),
  acceptsChildren: true,
} as TAction
