import { createPinia } from 'pinia'
import { createPiniaClient } from 'feathers-pinia'
import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { feathersClient } from '@/feathers'
import { AnyData } from '@/shared/interfaces/commons'

import health from '@/features/Health/service'
import events from '@/features/Events/service'
import users from '@/features/Users/service'
import groups from '@/features/Groups/service'
import plans from '@/features/Plans/service'
import shares from '@/features/Shares/service'
import tables from '@/features/Tables/service'
import stats from '@/features/Stats/service'
import menus from '@/features/Menus/service'
import forms from '@/features/Forms/service'
import actions from '@/features/Actions/service'
import files from '@/features/Files/service'

import { mongoId } from '@/features/Validation/helpers'
import { tableSchema, tableFieldSchema } from '@/shared/schemas/table'
import { refFieldname } from '@/shared/schema'

export const pinia = createPinia()

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

// const syncWithStorage = ['itemsById']

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

  setupInstance(data: AnyData, { app, servicePath }): AnyData {
    /* eslint-disable no-param-reassign */
    data._id = data._id || undefined
    data.createdAt = data.createdAt || undefined
    data.createdBy = data.createdBy || undefined
    data.updatedAt = data.updatedAt || undefined
    data.updatedBy = data.updatedBy || undefined
    data.deletedAt = data.deletedAt || undefined
    data.deletedBy = data.deletedBy || undefined
    /* eslint-enable no-param-reassign */

    // it's a user's table, check for referenced fields
    if (mongoId.test(servicePath)) {
      const userTables = app.service('tables').findOneInStore({ query: {} }).value
      if (userTables) {
        const table = userTables.list.find((t: Table) => t._id === servicePath)
        if (table) {
          // build a config for each field in the table that is referenced
          const config = {}
          table.fields.forEach((f: TableField) => {
            if (f.refTableId) {
              config[refFieldname(f.name)] = f.refTableId
            }
          })
          // associate ref table fields to stores
          app.storeAssociated(data, config)
        }
      }
    }

    return data
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customizeStore(defaultStore: AnyData): AnyData {
    return {}
  },

  services: {
    health,
    events,
    users,
    groups,
    plans,
    shares,
    tables,
    stats,
    menus,
    forms,
    actions,
    files,
  },
})
