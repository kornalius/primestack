import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - menus')

  // eslint-disable-next-line no-param-reassign
  data.menus = {}
  // eslint-disable-next-line no-param-reassign
  data.menus.admin = await app.service('menus').create({
    list: [
      {
        _id: '64b5955ef3555ebcce00fee2',
        label: 'Test 1',
        icon: 'mdi-archive-cog',
        color: 'red-3',
        target: '_self',
        tabs: [
          {
            _id: '64b4049c8a7de5f30a638852',
            label: 'Tab 1',
            icon: 'mdi-archive-cog',
            color: 'red-3',
            formId: data.forms.admin.list[0]._id.toString(),
          },
          {
            _id: '64b404bbc0bab3cd5e013ae0',
            label: 'Tab 2',
            icon: 'mdi-archive-edit',
            color: 'orange-3',
            formId: data.forms.admin.list[1]._id.toString(),
          },
        ],
      },
    ],
  }, { user: data.auth.user })
}
