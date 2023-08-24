import fs from 'fs'
import { Params } from '@feathersjs/feathers'
import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { BaseService, createSchemalessService } from '@/service'

const path = 'uploads'

class Service extends BaseService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any, params?: Params) {
    const { file } = params as AnyData
    const { filepath } = file

    let resp

    // call the files service to upload it via Soap
    try {
      resp = await this.app.service('files').create({
        newFilename: file.newFilename,
        originalFilename: file.originalFilename,
        filepath: file.filepath,
        mimetype: file.mimetype,
        size: file.size,
      }, params)
    } catch (e) {
      // delete file after finished
      fs.unlinkSync(filepath)
      throw e
    }

    return resp
  }
}

export default function (app: Application): void {
  createSchemalessService(path, Service, {
    authentication: true,
    methods: ['create'],
  }).init(app, {})
}
