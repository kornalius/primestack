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
import { Params } from '@feathersjs/feathers'
import { NullableAdapterId } from '@feathersjs/mongodb/src/adapter'

dataValidator.addSchema(schema)

type Stats = Static<typeof schema>

const path = 'stats'

const states: AnyData = {}

const buildPipeline = (data: Stats, params?: MongoDBAdapterParams): AnyData => {
  const {
    type,
    field,
    groupFields,
    query,
  } = data

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

  return p
}

class Service extends MongoService {
  // eslint-disable-next-line class-methods-use-this
  get(id: AdapterId, params?: MongoDBAdapterParams): Promise<AnyData> {
    return states[id.toString()] || {}
  }

  async create(data: AnyData, params?: MongoDBAdapterParams): Promise<AnyData>
  async create(data: AnyData[], params?: MongoDBAdapterParams): Promise<AnyData[]>
  async create(data: AnyData | AnyData[], params?: MongoDBAdapterParams): Promise<AnyData | AnyData[]>
  async create(data: AnyData | AnyData[], params?: MongoDBAdapterParams): Promise<AnyData | AnyData[]> {
    if (Array.isArray(data)) {
      throw new BadRequest()
    }

    const { app } = (this.options as AnyData)

    const { uuid } = data as Stats

    const p = buildPipeline(data as Stats, params)

    const r = (await app.service(data.path).find(p))[0]

    states[uuid] = {
      _id: uuid,
      path: data.path,
      type: data.type,
      field: data.field,
      value: Math.round(r?.value || 0),
    }

    return states[uuid]
  }

  async patch(id: null, data: AnyData, params?: Params): Promise<AnyData[]>
  async patch(id: AdapterId, data: AnyData, params?: Params): Promise<AnyData>
  async patch(id: NullableAdapterId, data: AnyData, params?: Params): Promise<AnyData | AnyData[]>
  async patch(id: NullableAdapterId, data: AnyData, params?: Params): Promise<AnyData | AnyData[]> {
    if (Array.isArray(data)) {
      throw new BadRequest()
    }

    const { app } = (this.options as AnyData)

    const { uuid } = data as Stats

    const p = buildPipeline(data as Stats, params)

    const r = (await app.service(data.path).find(p))[0]

    states[uuid] = {
      _id: uuid,
      path: data.path,
      type: data.type,
      field: data.field,
      value: Math.round(r?.value || 0),
    }

    return states[uuid]
  }
}

export default function (app: Application): void {
  createService(path, Service, {
    schema,
    methods: ['get', 'create', 'patch'],
    events: ['calculate'],
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
