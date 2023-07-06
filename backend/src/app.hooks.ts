import { countCalls } from './hooks/count-calls'
import { logError } from './hooks/log-error'

export default {
  around: {
    all: [
      logError,
    ],
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
}
