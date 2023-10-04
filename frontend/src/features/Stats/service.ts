import { useInstanceDefaults } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/stats'
// eslint-disable-next-line import/no-cycle
import { api } from '@/plugins/pinia'

type StatsInterface = Static<typeof schema>

export default {
  setupInstance: (data: StatsInterface): StatsInterface => {
    console.log(data)
    api.service(data.path).on('created', (...args) => {
      console.log('created', args)
    })
    return useInstanceDefaults({}, data)
  },
}
