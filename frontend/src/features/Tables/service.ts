import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/table'

type TableList = Static<typeof schema>

export default {
  setupInstance: (data: TableList): TableList => (
    useInstanceDefaults({
      list: [],
    }, data)
  ),
}
