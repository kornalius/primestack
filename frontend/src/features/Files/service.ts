import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/file'

type FileInterface = Static<typeof schema>

export default {
  setupInstance: (data: FileInterface): FileInterface => (
    useInstanceDefaults({
      size: 0,
      state: 0,
      progress: 0,
    }, data)
  ),
}
