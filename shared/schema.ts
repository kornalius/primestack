import { Static, TSchema, Type } from '@feathersjs/typebox'
import omit from 'lodash/omit'
import { fieldSchema } from './schemas/schema'

export const optionsForSchema = (p: TSchema): unknown[] => {
  if (p.enum) {
    return p.enum.map((e) => ({ label: e, value: e }))
  }
  if (p.items?.enum) {
    return p.items.enum.map((e) => ({ label: e, value: e }))
  }
  return p.options || p.items?.options
}

export const getTypeFor = (p: TSchema, forcedType?: string): string => {
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
  if (p.type === 'string' && p.objectid === true) {
    return 'objectid'
  }
  if (p.type === 'string' && p.format === 'date') {
    return 'date'
  }
  if (p.type === 'string' && p.format === 'time') {
    return 'time'
  }
  if (p.type === 'string' && Array.isArray(options)) {
    return 'select'
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
    default: return 'mdi-help'
  }
}

type TField = Static<typeof fieldSchema>

export const fieldToSchema = (field: TField): TSchema => {
  if (field.array) {
    const a = Type.Array(fieldToSchema({
      ...field,
      array: false,
    } as TField))
    if (field.optional) {
      return Type.Optional(a)
    }
    return a
  }

  switch (field.type) {
    case 'string':
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

    case 'number':
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
      const c = Type.String({
        color: true,
      })
      if (field.optional) {
        return Type.Optional(c)
      }
      return c

    case 'icon':
      const i = Type.String({
        icon: true,
      })
      if (field.optional) {
        return Type.Optional(i)
      }
      return i

    case 'select':
      const e = Type.String({
        options: field.options,
      })
      if (field.optional) {
        return Type.Optional(e)
      }
      return e
  }
}

export const fieldsToSchema = (fields: TField[]): TSchema => {
  return Type.Object(fields.reduce((acc, f) => ({
    ...acc,
    [f.name]: fieldToSchema(f),
  }), {}))
}
