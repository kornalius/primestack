import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'unsetvar',
  label: 'actions.unsetsetting.label',
  schema: Type.Object({
    name: ExType.UserSetting(),
  }),
} as TAction
