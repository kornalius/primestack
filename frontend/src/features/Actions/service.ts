import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/actions'

type ActionList = Static<typeof schema>

export default {
  setupInstance: (data: ActionList): ActionList => (
    useInstanceDefaults({
      list: [],
    }, data)
  ),
}
