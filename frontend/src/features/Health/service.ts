import { useInstanceDefaults } from 'feathers-pinia'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/health'

type Health = Static<typeof schema>

export default {
  setupInstance: (data: Health): Health => (
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
