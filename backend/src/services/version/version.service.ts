import { Application } from '@feathersjs/koa'
import { Type } from '@feathersjs/typebox'
import { Id, Params } from '@feathersjs/feathers'
import { AnyData } from '@/shared/commons'
import { BaseService, createService } from '../../service'

const path = 'version'

class Service extends BaseService {
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  async get(id: Id, _params?: Params): Promise<AnyData> {
    return {
      id,
      version: process.env.npm_package_version,
    }
  }
}

export default function (app: Application): void {
  createService('version', Service, {
    schema: Type.Object(
      {
        id: Type.String({ objectid: true }),
        version: Type.String(),
      },
      { $id: 'Version', additionalProperties: false }
    ),
    methods: ['get'],
  }).init(app, { app })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
