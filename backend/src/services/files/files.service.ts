import fs from 'fs'
import { Application } from '@feathersjs/koa'
import { Static } from '@feathersjs/typebox'
import { AdapterId } from '@feathersjs/mongodb'
import { NullableAdapterId } from '@feathersjs/mongodb/src/adapter'
import { Params } from '@feathersjs/feathers'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/file'
import { dataValidator } from '@/validators'
import { checkMaxFiles, checkMaxFileSize } from './files.hooks'

dataValidator.addSchema(schema)

type FileInterface = Static<typeof schema>

const path = 'files'
const collection = 'files'

export const readFiles = async (files: FileInterface[]): Promise<FileInterface[]> => {
  const promises = files.map((file): Promise<FileInterface> => (
    new Promise((resolve, reject) => {
      let encoded = ''

      fs.createReadStream(file.filepath, 'base64')
        .on('data', (chunk) => {
          encoded = `${encoded}${chunk}`
        })

        .on('error', (e) => {
          reject(e)
        })

        // when reading is finished
        .on('end', async () => {
          // eslint-disable-next-line no-param-reassign
          file.data = encoded
          resolve(file)
        })
    })
  ))

  return Promise.all(promises)
}

class Service extends MongoService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async remove(id: NullableAdapterId, params?: Params): Promise<any> {
    // eslint-disable-next-line no-underscore-dangle
    const f = await this._get(id as AdapterId)
    if (f) {
      try {
        fs.unlinkSync(f.filepath)
      } catch (e) {
        //
      }
    }
    return super.remove(id, params)
  }
}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    created: true,
    updated: true,
    methods: ['find', 'get', 'create', 'remove'],
    hooks: {
      before: {
        all: [],
        create: [
          checkMaxFiles,
          checkMaxFileSize,
        ]
      }
    }
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
