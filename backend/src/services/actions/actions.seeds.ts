import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - actions')

  // eslint-disable-next-line no-param-reassign
  data.actions = {}

  // eslint-disable-next-line no-param-reassign
  data.actions.admin = await app.service('actions').create({
    list: [
      {
        _id: '64f8d31ec5d5795fb8aba9a5',
        _internalType: 'action',
        _actions: [
          {
            _id: '64f8d321c5d5795fb8aba9a6',
            _internalType: 'action-element',
            _type: 'dialog',
            _children: [
              {
                _id: '64f8d34ec5d5795fb8aba9aa',
                _type: 'insert',
                _internalType: 'action-element',
                _children: [],
                tableId: '64b806da03ac5093de3f3e78',
                fields: [
                  {
                    name: 'stringField',
                    value: 'A'
                  },
                  {
                    name: 'numberField',
                    value: '```1234```'
                  },
                  {
                    name: 'booleanField',
                    value: '```true```'
                  }
                ]
              },
              {
                _id: '64f8d379c5d5795fb8aba9ac',
                _internalType: 'action-element',
                _type: 'notify',
                _children: [],
                level: 'Success',
                message: 'Success MTF!!!'
              }
            ],
            title: 'Insert',
            message: 'Create a new record?',
            ok: {
              color: 'green',
              outline: true
            },
            cancel: {
              color: 'red',
              outline: true
            }
          },
          {
            _id: '6511ddc72e6a41d571197e58',
            _internalType: 'action-element',
            _type: 'console',
            _children: [],
            type: 'info',
            message: '```var(\'$x\')```'
          }
        ]
      },
      {
        _id: '6527f8eac1d3405a5c05f727',
        _internalType: 'action',
        _actions: [
          {
            _id: '6527f8ebc1d3405a5c05f728',
            _internalType: 'action-element',
            _type: 'fetch',
            _children: [],
            method: 'GET',
            credentials: 'omit',
            redirect: 'follow',
            cache: 'no-cache',
            href: 'http://localhost:3030/test.json',
            target: 'JSON',
            mode: undefined,
            referrerPolicy: undefined,
            headers: []
          },
          {
            _id: '65280e41a252c8ac28f57f33',
            _internalType: 'action-element',
            _type: 'dialog',
            _children: [],
            title: 'JSON File',
            message: '```$result()```',
            ok: {
              color: 'green',
              outline: true
            },
            cancel: {
              color: 'red',
              outline: true
            }
          }
        ]
      },
      {
        _id: '653822171a45ca1378d2e974',
        _internalType: 'action',
        _actions: [
          {
            _id: '6538221a1a45ca1378d2e975',
            _internalType: 'action-element',
            _type: 'console',
            _children: [],
            type: 'log',
            message: 'Mindblowned!!!'
          }
        ]
      },
      {
        _id: '653a5e2d03997b38578dde6d',
        _internalType: 'action',
        _actions: [
          {
            _id: '653a5e3003997b38578dde6e',
            _internalType: 'action-element',
            _type: 'console',
            _children: [],
            type: 'log',
            message: 'Menu Clicked'
          }
        ]
      },
      {
        _id: '653a5fca03997b38578ddf0d',
        _internalType: 'action',
        _actions: [
          {
            _id: '653a5fcb03997b38578ddf0e',
            _internalType: 'action-element',
            _type: 'console',
            _children: [],
            type: 'log',
            message: 'Second tab clicked'
          }
        ]
      },
      {
        _id: '654a9873b41af5a32367b4a5',
        _internalType: 'action',
        _actions: [
          {
            _id: '654a9875b41af5a32367b4a6',
            _internalType: 'action-element',
            _type: 'console',
            _children: [],
            type: 'log',
            message: 'Created!!!'
          }
        ]
      },
      {
        _id: '6553c18dce5fa00566256577',
        _internalType: 'action',
        _actions: [
          {
            _id: '6553c198ce5fa00566256595',
            _internalType: 'action-element',
            _type: 'console',
            _children: [],
            type: 'log',
            message: 'This works'
          }
        ]
      }
    ],
  }, { user: data.auth.user })
}
