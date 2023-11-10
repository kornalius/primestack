import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/share'

type Share = Static<typeof schema>

export default {
  setupInstance: (data: Share): Share => (
    useInstanceDefaults({
      read: true,
      create: true,
      update: true,
      delete: true,
      disabled: false,
    }, data)
  ),
}
