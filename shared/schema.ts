import { Static, TSchema, Type } from '@feathersjs/typebox'
import { tableFieldSchema, tableIndexSchema } from './schemas/table'
import { AnyData } from './interfaces/commons'

export interface Index {
  fields: Record<string, number>
  unique?: boolean
  sparse?: boolean
  expireAfterSeconds?: number
}

export const optionsForSchema = (p: TSchema): unknown[] => {
  if (p.enum) {
    return p.enum.map((e: string) => ({ label: e, value: e }))
  }
  if (p.items?.enum) {
    return p.items.enum.map((e: string) => ({ label: e, value: e }))
  }
  return p.options || p.items?.options
}

export const getTypeFor = (p: TSchema, forcedType?: string): string | undefined => {
  if (!p) {
    return undefined
  }

  const options = optionsForSchema(p)

  if (forcedType) {
    return forcedType
  }

  if (p.type === 'number' && p.slider) {
    return 'slider'
  }
  if (p.type === 'number') {
    return 'number'
  }

  if (p.type === 'string' && p.field === true) {
    return 'field'
  }
  if (p.type === 'string' && p.objectid === true && p.tableid === true) {
    return 'tableid'
  }
  if (p.type === 'string' && p.objectid === true && p.action === true) {
    return 'action'
  }
  if (p.type === 'string' && p.objectid === true) {
    return 'objectid'
  }
  if (p.type === 'string' && p.format === 'date') {
    return 'date'
  }
  if (p.type === 'string' && p.format === 'time') {
    return 'time'
  }
  if (p.type === 'string' && Array.isArray(options) && p.toggles === true) {
    return 'toggles'
  }
  if (p.type === 'string' && Array.isArray(options)) {
    return 'select'
  }
  if (p.type === 'string' && p.variable) {
    return 'variable'
  }
  if (p.type === 'string' && p.color) {
    return 'color'
  }
  if (p.type === 'string' && p.icon) {
    return 'icon'
  }
  if (p.type === 'string' && p.enum) {
    return 'select'
  }
  if (p.type === 'string') {
    return 'string'
  }

  if (p.type === 'boolean') {
    return 'boolean'
  }

  if (p.type === 'array' && p.json === true) {
    return 'json'
  }
  if (p.type === 'array' && p.items?.type === 'string' && (Array.isArray(options) || p.enum)) {
    return 'select'
  }
  if (p.type === 'array') {
    return 'array'
  }

  if (p.type === 'object' && p.query === true) {
    return 'query'
  }
  if (p.type === 'object' && p.json === true) {
    return 'json'
  }
  if (p.type === 'object' && p.padding) {
    return 'padding'
  }
  if (p.type === 'object' && p.margin) {
    return 'margin'
  }
  if (p.type === 'object') {
    return 'object'
  }

  if (p.anyOf) {
    return getTypeFor(p.anyOf[0])
  }

  return 'string'
}

export const validForExpr = [
  'boolean',
  'number',
  'string',
  'color',
  'field',
  'tableid',
  'time',
  'date',
  'slider',
  'select',
  'icon',
]

export const columnAlignmentFor = (type: string): string => {
  if (type === 'boolean') {
    return 'center'
  }
  if (type === 'number') {
    return 'right'
  }
  return 'left'
}

export const defaultValueForSchema = (schema: TSchema, forcedType?: string): unknown => {
  switch (forcedType || schema?.type) {
    case 'string': return undefined
    case 'number': return 0
    case 'boolean': return false
    case 'array': return []
    case 'object':
      return Object.keys(schema.properties)
        .reduce((acc, k) => (
          { ...acc, [k]: defaultValueForSchema(schema.properties[k]) }
        ), {})
    default: return undefined
  }
}

export const defaultValues = (values: AnyData | undefined): AnyData | undefined => {
  if (!values) {
    return undefined
  }

  const nv: AnyData = {}
  Object.keys(values).forEach((k) => {
    const v = values[k]
    if (typeof v === 'function') {
      nv[k] = v()
    } else {
      nv[k] = v
    }
  })
  return nv
}

const omit = (obj: AnyData, props: string[]) => {
  const result = { ...obj }
  props.forEach((prop) => {
    delete result[prop]
  })
  return result
}

export const omitFields = (schema: TSchema, fields: string[]): TSchema => ({
  ...schema,
  properties: omit(schema.properties, fields),
})

export const iconForType = (type: string): string => {
  switch (type) {
    case 'string': return 'mdi-format-quote-close'
    case 'number': return 'mdi-pound'
    case 'boolean': return 'mdi-check'
    case 'color': return 'mdi-eyedropper-variant'
    case 'icon': return 'mdi-star'
    case 'date': return 'mdi-calendar-check'
    case 'time': return 'mdi-clock'
    case 'select': return 'mdi-form-select'
    case 'array': return 'mdi-code-array'
    case 'objectid': return 'mdi-identifier'
    case 'object': return 'mdi-code-json'
    case 'query': return 'mdi-filter'
    default: return 'mdi-help'
  }
}

type TableFieldSchema = Static<typeof tableFieldSchema>

export const fieldToSchema = (field: TableFieldSchema): TSchema => {
  if (field.array) {
    const a = Type.Array(fieldToSchema({
      ...field,
      array: false,
    } as TableFieldSchema))
    if (field.optional) {
      return Type.Optional(a)
    }
    return a
  }

  switch (field.type) {
    case 'string':
      // eslint-disable-next-line no-case-declarations
      const s = Type.String({
        format: field.format,
        minLength: field.min,
        maxLength: field.max,
        pattern: field.pattern,
      })
      if (field.optional) {
        return Type.Optional(s)
      }
      return s

    case 'boolean':
      // eslint-disable-next-line no-case-declarations
      const b = Type.Boolean({})
      if (field.optional) {
        return Type.Optional(b)
      }
      return b

    case 'number':
      // eslint-disable-next-line no-case-declarations
      const n = Type.Number({
        slider: field.slider,
        minimum: field.min,
        maximum: field.max,
        exclusiveMinimum: field.exclusiveMin,
        exclusiveMaximum: field.exclusiveMax,
      })
      if (field.optional) {
        return Type.Optional(n)
      }
      return n

    case 'date':
      // eslint-disable-next-line no-case-declarations
      const d = Type.String({
        format: 'date',
        formatMinimum: field.dateMin,
        formatMaximum: field.dateMax,
        exclusiveMinimum: field.dateExclusiveMin,
        exclusiveMaximum: field.dateExclusiveMax,
      })
      if (field.optional) {
        return Type.Optional(d)
      }
      return d

    case 'time':
      // eslint-disable-next-line no-case-declarations
      const t = Type.String({
        format: 'time',
        formatMinimum: field.dateMin,
        formatMaximum: field.dateMax,
        exclusiveMinimum: field.dateExclusiveMin,
        exclusiveMaximum: field.dateExclusiveMax,
      })
      if (field.optional) {
        return Type.Optional(t)
      }
      return t

    case 'color':
      // eslint-disable-next-line no-case-declarations
      const c = Type.String({
        color: true,
      })
      if (field.optional) {
        return Type.Optional(c)
      }
      return c

    case 'icon':
      // eslint-disable-next-line no-case-declarations
      const i = Type.String({
        icon: true,
      })
      if (field.optional) {
        return Type.Optional(i)
      }
      return i

    case 'select':
      // eslint-disable-next-line no-case-declarations
      const e = Type.String({
        options: field.options,
      })
      if (field.optional) {
        return Type.Optional(e)
      }
      return e

    default:
      if (field.optional) {
        return Type.Optional(Type.String())
      }
      return Type.String()
  }
}

export const fieldsToSchema = (fields: TableFieldSchema[], id: string): TSchema => (
  Type.Object((fields || []).reduce((acc, f) => ({
    ...acc,
    [f.name]: fieldToSchema(f),
  }), {}), { $id: id })
)

type TableIndexSchema = Static<typeof tableIndexSchema>

export const indexesToMongo = (indexes: TableIndexSchema[]): Index[] => (
  indexes.map((i) => ({
    fields: { [i.name]: i.order },
    unique: i.unique,
    sparse: i.sparse,
  }))
)
