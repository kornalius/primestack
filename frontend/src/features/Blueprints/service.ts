import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/blueprints'

type Blueprint = Static<typeof schema>

export default {
  setupInstance: (data: Blueprint): Blueprint => (
    useInstanceDefaults({
      list: [],
    }, data)
  ),
}
