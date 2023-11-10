import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/menu'

type MenuList = Static<typeof schema>

export default {
  setupInstance: (data: MenuList): MenuList => (
    useInstanceDefaults({
      list: [],
    }, data)
  ),
}
