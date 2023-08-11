import { createPinia } from 'pinia'
import { createPiniaClient } from 'feathers-pinia'
import { feathersClient } from '@/feathers'
import { AnyData } from '@/shared/interfaces/commons'

import health from '@/features/Health/service'
import users from '@/features/Users/service'
import plans from '@/features/Plans/service'
import tables from '@/features/Tables/service'
import menus from '@/features/Menus/service'
import forms from '@/features/Forms/service'
import actions from '@/features/Actions/service'

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
    /* eslint-disable no-param-reassign */
    data._id = data._id || undefined
    data.createdAt = data.createdAt || undefined
    data.createdBy = data.createdBy || undefined
    data.updatedAt = data.updatedAt || undefined
    data.updatedBy = data.updatedBy || undefined
    data.deletedAt = data.deletedAt || undefined
    data.deletedBy = data.deletedBy || undefined
    /* eslint-enable no-param-reassign */
    return data
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customizeStore(defaultStore: AnyData): AnyData {
    return {}
  },

  services: {
    health,
    users,
    plans,
    tables,
    menus,
    forms,
    actions,
  },
})
