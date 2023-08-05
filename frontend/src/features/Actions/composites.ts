import omit from 'lodash/omit'
import { Static } from '@feathersjs/typebox'
import { componentForAction, actions, actionsByType } from '@/features/Actions/definitions'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'

type Action = Static<typeof actionElementSchema>

export default () => ({
  componentForAction,

  actionsByType,

  actions,

  actionBinds: (action: Action): AnyData => {
    const fieldsToOmit = [
      '_id',
      '_type',
      '_children',
    ]
    return omit(action, fieldsToOmit)
  },
})
