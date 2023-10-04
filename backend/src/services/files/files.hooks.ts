import i18next from 'i18next'
import { HookContext } from '@feathersjs/feathers'
import { BadRequest, Forbidden } from '@feathersjs/errors'
import { formatSize } from '@/shared/files/utils'

const checkMaxFiles = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { count } = await context.app.service(context.path).find({ query: { $limit: 0 } })
  const m = context.params?.user?.rights?.maxes?.maxFiles
  if (m !== -1 && count >= m) {
    throw new Forbidden(i18next.t('paid_feature.file', {
      fileCount: m,
      count: m,
      lng: context.params?.user?.lng as string || 'en',
    }))
  }
  return context
}

const checkMaxFileSize = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxFileSize
  if (m !== -1 && context.data.size >= m) {
    throw new Forbidden(i18next.t('paid_feature.fileSize', {
      size: formatSize(m),
      lng: context.params?.user?.lng as string || 'en',
    }))
  }
  return context
}

const checkRequiredQueryFields = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  // if no query provided
  if (context.method === 'find') {
    if (!context.params?.query.tableId) {
      throw new BadRequest(i18next.t('query.missingField', {
        name: 'tableId',
        lng: context.params?.user?.lng as string || 'en',
      }))
    }

    if (!context.params?.query.docId) {
      throw new BadRequest(i18next.t('query.missingField', {
        // eslint-disable-next-line no-underscore-dangle
        name: 'docId',
        lng: context.params?.user?.lng as string || 'en',
      }))
    }
  }
  return context
}

export default {
  before: {
    all: [
      checkRequiredQueryFields,
    ],
    create: [
      checkMaxFiles,
      checkMaxFileSize,
    ]
  }
}
