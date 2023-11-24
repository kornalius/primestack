import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { ACCESS_LEVEL_READONLY, schema } from '@/shared/schemas/share'

type Share = Static<typeof schema>

export default {
  setupInstance: (data: Share): Share => (
    useInstanceDefaults({
      accessLevel: ACCESS_LEVEL_READONLY,
      rules: [],
      disabled: false,
    }, data)
  ),
}
