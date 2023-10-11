import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'extract',
  label: 'Extract',
  schema: Type.Object({
    value: ExType.JSON(),
    fields: Type.Array(Type.String({ jsonkeys: true, jsonProp: '../value' })),
  }),
} as TAction
