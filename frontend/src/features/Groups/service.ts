import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/group'

type GroupInterface = Static<typeof schema>

export default {
  setupInstance: (data: GroupInterface): GroupInterface => (
    useInstanceDefaults({
      maxTables: 0,
      maxMenus: 0,
      maxForms: 0,
      maxEdits: 0,
      maxRecords: 0,
      maxFiles: 0,
      maxFileSize: 0,
      maxSettings: 0,
      read: [],
      create: [],
      update: [],
      delete: [],
    }, data)
  ),
}
