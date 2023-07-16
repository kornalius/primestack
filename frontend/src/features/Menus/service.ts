import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/menu'

type MenuInterface = Static<typeof schema>

export default {
  setupInstance: (data: MenuInterface): MenuInterface => (
    useInstanceDefaults({
      list: [],
    }, data)
  ),
}
