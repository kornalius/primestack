import { Application } from '@feathersjs/koa'
import { Type } from '@feathersjs/typebox'
import { Id, Params } from '@feathersjs/feathers'
import { AnyData } from '@/shared/commons'
import { totalCalls } from '@/hooks/count-calls'
import { BaseService, createService } from '@/service'

const path = 'health'

let startTime: number

class Service extends BaseService {
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  async get(id: Id, _params?: Params): Promise<AnyData> {
    return {
      _id: id,
      version: process.env.npm_package_version,
      uptime: Date.now() - startTime,
      calls: totalCalls,
    }
  }
}

export default function (app: Application): void {
  startTime = Date.now()

  createService(path, Service, {
    schema: Type.Object(
      {
        _id: Type.String({ objectid: true }),
        version: Type.String(),
        uptime: Type.Number(),
      },
      { $id: 'Health', additionalProperties: false }
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
