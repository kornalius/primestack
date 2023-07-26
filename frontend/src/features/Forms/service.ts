import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/form'

type FormInterface = Static<typeof schema>

export default {
  setupInstance: (data: FormInterface): FormInterface => (
    useInstanceDefaults({
      list: [],
    }, data)
  ),
}
