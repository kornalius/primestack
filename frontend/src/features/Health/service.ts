import { useInstanceDefaults } from 'feathers-pinia'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/health'

type HealthInterface = Static<typeof schema>

export default {
  setupInstance: (data: HealthInterface): HealthInterface => (
    useInstanceDefaults({
      version: '',
      uptime: 0,
      calls: {
        total: 0,
        find: 0,
        get: 0,
        create: 0,
        update: 0,
        patch: 0,
        remove: 0,
      },
    }, data)
  ),
}
