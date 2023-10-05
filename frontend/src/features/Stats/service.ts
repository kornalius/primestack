import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/stats'

type StatsInterface = Static<typeof schema>

export default {
  setupInstance: (data: StatsInterface): StatsInterface => (
    useInstanceDefaults({}, data)
  ),
}
