import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/user'

type User = Static<typeof schema>

export default {
  setupInstance: (data: User): User => (
    useInstanceDefaults({
      email: undefined,
      username: undefined,
      firstname: undefined,
      lastname: undefined,
      maxTables: 0,
      maxMenus: 0,
      maxForms: 0,
      maxEdits: 0,
      maxRecords: 0,
      maxFiles: 0,
      maxFileSize: 0,
      planId: undefined,
      groupId: undefined,
      rules: [],
      locale: 'en',
      settings: {},
      sidebars: {},
    }, data)
  ),
}
