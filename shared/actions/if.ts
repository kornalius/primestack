import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export default {
  type: 'if',
  label: 'If',
  description: 'Checks the value of an expression, if true, executes the children actions',
  schema: Type.Object({
    expr: Type.String({ expr: true }),
  }),
  acceptsChildren: true,
} as TAction
