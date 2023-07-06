import { createPinia } from 'pinia'
import { createPiniaClient } from 'feathers-pinia'
import { feathersClient } from '@/feathers'
import { AnyData } from '@/shared/commons'

import health from '@/features/Health/service'

export const pinia = createPinia()

const syncWithStorage = ['itemsById']

export const api = createPiniaClient(feathersClient, {
  pinia,
  idField: '_id',
  // optional
  ssr: false,
  whitelist: [],
  paramsForServer: [],
  skipGetIfExists: false,
  customSiftOperators: {},
  syncWithStorage: false,
  storage: window.localStorage,

  setupInstance(data: AnyData): AnyData {
    return {
      id: undefined,
      created_at: undefined,
      created_by: undefined,
      updated_at: undefined,
      updated_by: undefined,
      deleted_at: undefined,
      deleted_by: undefined,
      ...data,
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customizeStore(defaultStore: AnyData): AnyData {
    return {}
  },

  services: {
    health,
  },
})
