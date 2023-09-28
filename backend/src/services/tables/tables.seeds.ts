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
        name: 'Test',
        methods: ['get', 'find', 'create'],
        created: true,
        updated: true,
        softDelete: true,
        user: true,
        fields: [
          {
            _id: '64affb4f2a4bb338b8b71d8b',
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
            order: 1,
            unique: true,
            sparse: false,
          },
        ],
      },
      {
        _id: '64f894f480db657a3ddbb054',
        name: 'Files',
        methods: ['get', 'find', 'remove'],
        created: true,
        updated: true,
        softDelete: false,
        user: false,
        fields: [
          {
            _id: '64f894f480db657a3ddbb055',
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
            name: 'size',
            type: 'number',
            hidden: false,
            optional: false,
            array: false,
            readonly: true,
            queryable: true,
          },
        ],
        indexes: [
        ],
        service: 'files',
      },
    ]
  }, { user: data.auth.user })
}
