import { Application } from '@feathersjs/koa'
import { Type, StringEnum } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'

const path = 'schemas'

class Service extends MongoService {}

export const supportedFieldTypes = ['string', 'number', 'boolean']

export default function (app: Application): void {
  createService(path, Service, {
    collection: 'schemas',
    schema: Type.Object(
      {
        _id: Type.String({ objectid: true }),
        name: Type.String(),
        methods: Type.Array(Type.String()),
        created: Type.Boolean(),
        updated: Type.Boolean(),
        softDelete: Type.Boolean(),
        user: Type.Boolean(),
        fields: Type.Array(Type.Object(
          {
            name: Type.String({ availableFieldname: true }),
            type: StringEnum(supportedFieldTypes),
            hidden: Type.Boolean(),
            array: Type.Boolean(),
            optional: Type.Boolean(),
            readonly: Type.Boolean(),
            queryable: Type.Boolean(),
          },
          { additionalProperties: false }
        )),
        indexes: Type.Array(Type.Object(
          {
            name: Type.String({ availableFieldname: true }),
            order: Type.Number({ minimum: -1, maximum: 1 }),
            unique: Type.Boolean(),
            sparse: Type.Boolean(),
          },
          { additionalProperties: false }
        )),
      },
      { $id: 'Schema', additionalProperties: false }
    ),
    indexes: [
      {
        fields: { name: 1 },
        unique: true,
      },
    ],
    created: true,
    updated: true,
    user: true,
    // authentication: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
