import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/file'

type File = Static<typeof schema>

export default {
  setupInstance: (data: File): File => (
    useInstanceDefaults({
      size: 0,
      state: 0,
      progress: 0,
    }, data)
  ),
}
