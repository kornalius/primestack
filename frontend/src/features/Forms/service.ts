import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/form'

type FormList = Static<typeof schema>

export default {
  setupInstance: (data: FormList): FormList => (
    useInstanceDefaults({
      list: [],
    }, data)
  ),
}
