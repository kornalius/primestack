import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'getsetting',
  label: 'actions.getsetting.label',
  schema: Type.Object({
    name: ExType.UserSetting(),
  }),
} as TAction
