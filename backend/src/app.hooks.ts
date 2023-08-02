import compact from 'lodash/compact'
import { countCalls } from './hooks/count-calls'
import { logError } from './hooks/log-error'
import { debug } from './hooks/debug'
import { Application } from './declarations'

export default (app: Application) => {
  app.hooks({
    around: {
      all: compact([
        app.get('debug') === 'verbose' ? debug : undefined,
        logError,
      ]),
    },

    before: {
      all: [
        countCalls,
      ],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },

    after: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },

    error: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    }
  })
}
