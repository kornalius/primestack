import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'unsetvar',
  label: 'Unset Setting',
  schema: Type.Object({
    name: ExType.UserSetting(),
  }),
} as TAction
