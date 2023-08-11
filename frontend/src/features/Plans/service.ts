import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/plan'

type PlanInterface = Static<typeof schema>

export default {
  setupInstance: (data: PlanInterface): PlanInterface => (
    useInstanceDefaults({
      price: 0.0,
      maxShares: 0,
      items: [],
      maxTables: 0,
      maxRecords: 0,
      maxFiles: 0,
      maxFileSize: 0,
    }, data)
  ),
}
