import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/plan'

type Plan = Static<typeof schema>

export default {
  setupInstance: (data: Plan): Plan => (
    useInstanceDefaults({
      price: 0.0,
      maxShares: 0,
      items: [],
      maxTables: 0,
      maxMenus: 0,
      maxForms: 0,
      maxEdits: 0,
      maxRecords: 0,
      maxFiles: 0,
      maxFileSize: 0,
      maxSettings: 0,
    }, data)
  ),
}
