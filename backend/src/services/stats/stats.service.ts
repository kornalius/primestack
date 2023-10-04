import i18next from 'i18next'
import { Static } from '@feathersjs/typebox'
import { Application } from '@feathersjs/koa'
import { AdapterId, MongoDBAdapterParams } from '@feathersjs/mongodb'
import { BadRequest } from '@feathersjs/errors'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { dataValidator } from '@/validators'
import { schema } from '@/shared/schemas/stats'

dataValidator.addSchema(schema)

type Stats = Static<typeof schema>

const path = 'stats'

const state: AnyData = {}

class Service extends MongoService {
  // eslint-disable-next-line class-methods-use-this
  get(id: AdapterId, params?: MongoDBAdapterParams): Promise<AnyData> {
    return state[id.toString()] || {}
  }

  async create(data: AnyData, params?: MongoDBAdapterParams): Promise<AnyData>
  async create(data: AnyData[], params?: MongoDBAdapterParams): Promise<AnyData[]>
  async create(data: AnyData | AnyData[], params?: MongoDBAdapterParams): Promise<AnyData | AnyData[]>
  async create(data: AnyData | AnyData[], params?: MongoDBAdapterParams): Promise<AnyData | AnyData[]> {
    if (Array.isArray(data)) {
      throw new BadRequest()
    }

    const { app } = (this.options as AnyData)

    const {
      uuid,
      path,
      type,
      field,
      groupFields,
      query,
    } = data as Stats

    const p = params || {}
    p.pipeline = []
    p.paginate = false
    p.query = query || {}

    const group = {
      _id: (Array.isArray(groupFields) && groupFields.length)
        ? groupFields.reduce((acc, g) => ({ ...acc, [g]: `$${g}` }), {})
        : null,
    }

    switch (type) {
      case 'count': {
        p.pipeline.push({
          $group: {
            ...group,
            value: { $sum: 1 },
          },
        })
        break
      }

      case 'sum': {
        p.pipeline.push({
          $group: {
            ...group,
            value: { $sum: `$${field}` },
          },
        })
        break
      }

      case 'avg': {
        p.pipeline.push({
          $group: {
            ...group,
            value: { $avg: `$${field}` },
          },
        })
        break
      }

      case 'min': {
        p.pipeline.push({
          $group: {
            ...group,
            value: { $min: `$${field}` },
          },
        })
        break
      }

      case 'max': {
        p.pipeline.push({
          $group: {
            ...group,
            value: { $max: `$${field}` },
          },
        })
        break
      }

      case 'empty': {
        p.pipeline.push({
          $match: {
            [field as string]: { $exists: false },
          },
        })
        p.pipeline.push({
          $count: 'value',
        })
        break
      }

      case '!empty': {
        p.pipeline.push({
          $match: {
            [field as string]: { $exists: true },
          },
        })
        p.pipeline.push({
          $count: 'value',
        })
        break
      }

      case '%empty': {
        p.pipeline.push({
          $group: {
            _id: null,
            empty: { $sum: { $cond: [{ $ifNull: [`$${field}`, 0] }, 0, 1] } },
            nonEmpty: { $sum: { $cond: [{ $ifNull: [`$${field}`, 0] }, 1, 0] } },
          }
        })
        p.pipeline.push({
          $project: {
            value: { $multiply: [100, { $divide: ['$empty', { $add: ['$empty', '$nonEmpty'] }] }] },
          }
        })
        break
      }

      case '%!empty': {
        p.pipeline.push({
          $group: {
            _id: null,
            empty: { $sum: { $cond: [{ $ifNull: [`$${field}`, 0] }, 0, 1] } },
            nonEmpty: { $sum: { $cond: [{ $ifNull: [`$${field}`, 0] }, 1, 0] } },
          }
        })
        p.pipeline.push({
          $project: {
            value: { $multiply: [100, { $divide: ['$nonEmpty', { $add: ['$empty', '$nonEmpty'] }] }] },
          }
        })
        break
      }

      default:
        break
    }

    if (p.pipeline.length === 0) {
      throw new BadRequest(i18next.t('stats.invalid_type', {
        lng: params?.user?.lng as string || 'en',
      }))
    }

    const r = (await app.service(path).find(p))[0]
    state[uuid] = {
      _id: uuid,
      path,
      type,
      field,
      value: Math.round(r?.value || 0),
    }
    return state[uuid]
  }
}

export default function (app: Application): void {
  createService(path, Service, {
    schema,
    methods: ['get', 'create'],
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
