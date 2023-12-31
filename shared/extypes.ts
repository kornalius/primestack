import { Type } from '@feathersjs/typebox'
import { AnyData } from './interfaces/commons'
import { getParentProp } from './properties'

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
  multiple?: boolean
  [key: string]: unknown
}

interface QueryOptions {
  disable?: (value: unknown, parent: AnyData) => boolean | string
  tableProp?: string
  [key: string]: unknown
}

export interface IdColumn {
  title?: string
  field: string
  size?: number
  filterable?: boolean
  class?: string
  style?: string
  titleClass?: string
  titleStyle?: string
}

interface IdOptions {
  service?: string
  query?: AnyData
  columns?: IdColumn[]
  valueField?: string
  labelField?: string
  [key: string]: unknown
}

interface ColorOptions {
  quasarPalette?: boolean
  [key: string]: unknown
}

interface JSONOptions {
  // for the visual json editor, the child type for the root array or object
  rootType?: 'array' | 'object' | 'string' | 'number' | 'boolean'
  [key: string]: unknown
}

interface UnitOptions {
  label?: string
  units?: { label: string, value: string }[]
  [key: string]: unknown
}

const Id = (options: IdOptions = {}) => Type.String({ objectid: true, ...options })

export default {
  Id,

  JSON: (options: JSONOptions = {}) => Type.Object({}, { json: true, ...options }),

  Email: (options = {}) => Type.String({ format: 'email', ...options }),

  Date: (options: DateOptions = {}) => Type.String({ format: 'date', ...options }),

  Time: (options: TimeOptions = {}) => Type.String({ format: 'time', ...options }),

  Color: (options: ColorOptions = {}) => Type.String({ color: true, ...options }),

  Icon: (options = {}) => Type.String({ icon: true, ...options }),

  Action: (options = {}) => Id({ service: 'actions', ...options }),

  Table: (options = {}) => Id({ tableid: true, ...options }),

  Variable: (options = {}) => Type.String({ variable: true, ...options }),

  UserSetting: (options = {}) => Type.String({ userSetting: true, ...options }),

  Expr: (options = {}) => Type.String({ expr: true, ...options }),

  Menu: (options = {}) => Id({ service: 'menus', ...options }),

  Tab: (options = {}) => Id({ service: 'tabs', ...options }),

  Query: (options: QueryOptions = {}) => Type.Object({}, {
    query: true,
    disable: (value: unknown, parents: AnyData[]) => (
      getParentProp(parents, options.tableProp || 'tableId')
        ? false
        : 'Please select a table first'
    ),
    ...options,
  }),

  Field: (options: FieldOptions = {}) => Type.String(
    { field: true, ...options },
  ),

  MultiField: (options: FieldOptions = {}) => Type.Array(
    Type.String({
      field: true,
      select: true,
      ...options,
    }),
  ),

  Slider: (options: SliderOptions = {}) => Type.Number({ slider: true, ...options }),

  Unit: (options: UnitOptions = {}) => Type.String({ unit: true, ...options }),
}
