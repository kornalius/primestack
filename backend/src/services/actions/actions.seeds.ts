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
        _actions: [
          {
            _id: '64f8d321c5d5795fb8aba9a6',
            _type: 'dialog',
            _children: [
              {
                _id: '64f8d34ec5d5795fb8aba9aa',
                _type: 'insert',
                _children: [],
                tableId: data.tables.admin.list[0]._id.toString(),
                fields: [
                  {
                    name: 'stringField',
                    value: 'A',
                  },
                  {
                    name: 'numberField',
                    value: '```1234```',
                  },
                  {
                    name: 'booleanField',
                    value: '```true```',
                  },
                ],
              },
              {
                _id: '64f8d379c5d5795fb8aba9ac',
                _type: 'notify',
                _children: [],
                level: 'Success',
                message: 'Success MTF!!!',
              },
            ],
            title: 'Insert',
            message: 'Create a new record?',
            ok: {
              color: 'green',
              outline: true,
            },
            cancel: {
              color: 'red',
              outline: true,
            },
          },
          {
            _id: '6511ddc72e6a41d571197e58',
            _type: 'console',
            _children: [],
            type: 'info',
            message: '```var(\'$x\')```',
          },
        ],
      },
    ],
  }, { user: data.auth.user })
}
