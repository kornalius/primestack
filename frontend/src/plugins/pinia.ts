import { createPinia } from 'pinia'
import { createPiniaClient } from 'feathers-pinia'
import { feathersClient } from '@/feathers'
import { AnyData } from '@/shared/interfaces/commons'

import health from '@/features/Health/service'
import users from '@/features/Users/service'
import tables from '@/features/Tables/service'
import menus from '@/features/Menus/service'
import forms from '@/features/Forms/service'

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
      _id: undefined,
      createdAt: undefined,
      createdBy: undefined,
      updatedAt: undefined,
      updatedBy: undefined,
      deletedAt: undefined,
      deletedBy: undefined,
      ...data,
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customizeStore(defaultStore: AnyData): AnyData {
    return {}
  },

  services: {
    health,
    users,
    tables,
    menus,
    forms,
  },
})
