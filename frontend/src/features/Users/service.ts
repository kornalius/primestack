import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/user'

type SchemaInterface = Static<typeof schema>

export default {
  setupInstance: (data: SchemaInterface): SchemaInterface => (
    useInstanceDefaults({
      email: undefined,
      username: undefined,
      firstname: undefined,
      lastname: undefined,
    }, data)
  ),
}
