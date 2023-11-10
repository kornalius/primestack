import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/stats'

type Stats = Static<typeof schema>

export default {
  setupInstance: (data: Stats): Stats => (
    useInstanceDefaults({}, data)
  ),
}
