import fs from 'fs'
import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/file'
import { dataValidator } from '@/validators'
import { Static } from '@feathersjs/typebox'

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
}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    created: true,
    updated: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
