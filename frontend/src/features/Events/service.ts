import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/event'

type EventInterface = Static<typeof schema>

export default {
  setupInstance: (data: EventInterface): EventInterface => (
    useInstanceDefaults({
      time: Date.now(),
    }, data)
  ),
}
