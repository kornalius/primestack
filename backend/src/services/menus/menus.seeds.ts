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
        _internalType: 'menu',
        label: 'Test 1',
        icon: 'mdi-archive-cog',
        color: 'red-3',
        target: '_self',
        tabs: [
          {
            _id: '64b4049c8a7de5f30a638852',
            _internalType: 'tab',
            label: 'Tab 1',
            icon: 'mdi-archive-cog',
            color: 'pink-4',
            formId: '64b410a0a8e639dab4e3e541',
            badgeTableId: '64b806da03ac5093de3f3e78',
            badgeField: '_id',
            badgeStat: 'count',
            description: 'Test tab 2'
          },
          {
            _id: '64b404bbc0bab3cd5e013ae0',
            _internalType: 'tab',
            label: 'Tab 2',
            icon: 'mdi-archive-edit',
            color: 'orange-3',
            formId: '64b410a0a8e639dab4e3e542',
            description: 'dasdasd',
            badgeTableId: null,
            badgeField: 'numberField',
            badgeStat: null,
            click: '653a5fca03997b38578ddf0d'
          }
        ],
        variables: [
          {
            _id: '653fedcbb1a90cc1d70fe3a4',
            name: 'myVar',
            value: 'test2'
          }
        ],
        description: 'Test menu item',
        href: null,
        click: '653a5e2d03997b38578dde6d'
      },
      {
        _id: '651dba055dd34ee03e2ed2d7',
        _internalType: 'menu',
        label: 'Test 2',
        icon: 'mdi-account-filter',
        target: '_self',
        tabs: [
        ],
        variables: [
        ]
      }
    ],
  }, { user: data.auth.user })
}
