import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'merge',
  label: 'Merge',
  schema: Type.Object({
    object1: ExType.JSON(),
    object2: ExType.JSON(),
  }),
} as TAction
