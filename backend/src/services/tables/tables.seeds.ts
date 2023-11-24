import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - tables')

  // eslint-disable-next-line no-param-reassign
  data.tables = {}
  // eslint-disable-next-line no-param-reassign
  data.tables.admin = await app.service('tables').create({
    list: [
      {
        _id: '64b806da03ac5093de3f3e78',
        _internalType: 'table',
        name: 'Test',
        path: '64b806da03ac5093de3f3e78',
        methods: ['get', 'find', 'create'],
        created: true,
        updated: true,
        softDelete: true,
        userRead: true,
        userWrite: true,
        fields: [
          {
            _id: '64affb4f2a4bb338b8b71d8b',
            _internalType: 'table-field',
            name: 'stringField',
            type: 'string',
            hidden: true,
            optional: false,
            array: false,
            readonly: false,
            queryable: true,
          },
          {
            _id: '64affb63b22ee0db653cf294',
            _internalType: 'table-field',
            name: 'numberField',
            type: 'number',
            hidden: false,
            optional: true,
            array: false,
            readonly: false,
            queryable: true,
          },
          {
            _id: '64b00979a16f8ec037f7e041',
            _internalType: 'table-field',
            name: 'booleanField',
            type: 'boolean',
            hidden: false,
            optional: true,
            array: false,
            readonly: false,
            queryable: true,
          },
        ],
        indexes: [
          {
            _id: '64affbcf36fd14263d91945e',
            name: 'stringField',
            fields: [
              {
                field: 'stringField',
                descending: false,
              }
            ],
            unique: true,
            sparse: false,
          },
        ],
      },
      {
        _id: '64f894f480db657a3ddbb054',
        _internalType: 'table',
        name: 'Files',
        path: '64f894f480db657a3ddbb054',
        methods: ['get', 'find', 'remove'],
        created: true,
        updated: true,
        softDelete: false,
        userRead: false,
        userWrite: true,
        fields: [
          {
            _id: '64f894f480db657a3ddbb055',
            _internalType: 'table-field',
            name: 'originalFilename',
            type: 'string',
            hidden: false,
            optional: false,
            array: false,
            readonly: true,
            queryable: true,
          },
          {
            _id: '64f894f480db657a3ddbb056',
            _internalType: 'table-field',
            name: 'mimetype',
            type: 'string',
            hidden: false,
            optional: false,
            array: false,
            readonly: true,
            queryable: true,
          },
          {
            _id: '64f894f480db657a3ddbb057',
            _internalType: 'table-field',
            name: 'size',
            type: 'number',
            hidden: false,
            optional: false,
            array: false,
            readonly: true,
            queryable: true,
          },
        ],
        indexes: [],
        service: 'files',
      },
    ]
  }, { user: data.auth.user })
}
