import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'select',
  label: 'actions.select.label',
  schema: Type.Object({
    rows: Type.Array(ExType.Id()),
  }),
} as TAction
