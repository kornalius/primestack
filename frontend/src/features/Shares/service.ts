import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/share'

type ShareInterface = Static<typeof schema>

export default {
  setupInstance: (data: ShareInterface): ShareInterface => (
    useInstanceDefaults({
      read: true,
      create: true,
      update: true,
      delete: true,
      disabled: false,
    }, data)
  ),
}
