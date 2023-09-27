import { Type } from '@feathersjs/typebox'
import { AnyData } from './interfaces/commons'

interface DateOptions {
  formatMinimum?: string
  formatMaximum?: string
  exclusiveMinimum?: string
  exclusiveMaximum?: string
  [key: string]: unknown
}

interface TimeOptions {
  formatMinimum?: string
  formatMaximum?: string
  exclusiveMinimum?: string
  exclusiveMaximum?: string
  [key: string]: unknown
}

interface SliderOptions {
  minimum?: number
  maximum?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  [key: string]: unknown
}

interface FieldOptions {
  tableProp?: string
  select?: boolean
  [key: string]: unknown
}

interface QueryOptions {
  disable?: (value: unknown, parent: AnyData) => boolean | string
  tableProp?: string
  [key: string]: unknown
}

interface IdOptions {
  service?: string
  [key: string]: unknown
}

const Id = (options: IdOptions = {}) => Type.String({ objectid: true, ...options })

export default {
  Id,

  JSON: (options = {}) => Type.Object({}, { json: true, ...options }),

  Email: (options = {}) => Type.String({ format: 'email', ...options }),

  Date: (options: DateOptions = {}) => Type.String({ format: 'date', ...options }),

  Time: (options: TimeOptions = {}) => Type.String({ format: 'time', ...options }),

  Color: (options = {}) => Type.String({ color: true, ...options }),

  Icon: (options = {}) => Type.String({ icon: true, ...options }),

  Action: (options = {}) => Id({ action: true, ...options }),

  Table: (options = {}) => Id({ tableid: true, ...options }),

  Variable: (options = {}) => Type.String({ variable: true, ...options }),

  Expr: (options = {}) => Type.String({ expr: true, ...options }),

  Query: (options: QueryOptions = {}) => Type.Object({}, {
    query: true,
    disable: (value: unknown, parent: AnyData) => (
      parent[options.tableProp || 'tableId'] ? false : 'Please select a table first'
    ),
    ...options,
  }),

  Field: (options: FieldOptions = {}) => Type.String(
    { field: true, ...options },
  ),

  Slider: (options: SliderOptions = {}) => Type.Number({ slider: true, ...options }),
}
