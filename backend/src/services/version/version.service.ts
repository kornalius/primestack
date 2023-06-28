import { Application } from '@feathersjs/koa'
import { Id, NullableId, Params } from '@feathersjs/feathers'
import { MethodNotAllowed } from '@feathersjs/errors'
import hooks from './version.hooks'

const path = 'version'

interface Data {
  id: Id
  version?: string
}

export class Version {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async create(data: Data, params?: Params): Promise<Data> {
    throw new MethodNotAllowed()
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[]> {
    throw new MethodNotAllowed()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async get(id: Id, params?: Params): Promise<Data> {
    // must provide an id to put it in the frontend vuex store
    return {
      id,
      version: process.env.npm_package_version,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new MethodNotAllowed()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    throw new MethodNotAllowed()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,class-methods-use-this
  async remove(id: NullableId, params?: Params): Promise<Data> {
    throw new MethodNotAllowed()
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  app.use(path, new Version())

  // Get our initialized service so that we can register hooks
  const service = app.service(path)

  service.hooks(hooks)
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Version
  }
}
