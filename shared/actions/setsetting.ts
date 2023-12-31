import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'setsetting',
  label: 'actions.setsetting.label',
  schema: Type.Object({
    name: ExType.UserSetting(),
    value: Type.String(),
  }),
} as TAction
