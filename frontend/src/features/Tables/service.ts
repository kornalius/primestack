import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/table'

type SchemaInterface = Static<typeof schema>

export default {
  setupInstance: (data: SchemaInterface): SchemaInterface => (
    useInstanceDefaults({
      userId: undefined,
      list: [],
    }, data)
  ),
}
