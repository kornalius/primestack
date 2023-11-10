import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/event'

type Event = Static<typeof schema>

export default {
  setupInstance: (data: Event): Event => (
    useInstanceDefaults({
      time: Date.now(),
    }, data)
  ),
}
