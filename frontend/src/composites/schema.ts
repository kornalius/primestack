import { TSchema } from '@feathersjs/typebox'

const optionsForSchema = (p: TSchema): unknown[] => {
  if (p.enum) {
    return p.enum.map((e) => ({ label: e, value: e }))
  }
  if (p.items?.enum) {
    return p.items.enum.map((e) => ({ label: e, value: e }))
  }
  return p.options || p.items?.options
}

const getTypeFor = (p: TSchema, forcedType?: string): string => {
  const options = optionsForSchema(p)

  if (forcedType) {
    return forcedType
  }
  if (p.type === 'number' && p.minimum !== undefined && p.maximum !== undefined) {
    return 'slider'
  }
  if (p.type === 'number') {
    return 'number'
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
  if (p.type === 'array' && p.items?.type === 'string' && Array.isArray(options)) {
    return 'select'
  }
  if (p.type === 'array') {
    return 'array'
  }
  if (p.type === 'object') {
    return 'object'
  }
  if (p.anyOf) {
    return getTypeFor(p.anyOf[0])
  }
  return 'string'
}

const iconForType = (type: string): string => {
  switch (type) {
    case 'string': return 'mdi-format-quote-close'
    case 'number': return 'mdi-pound'
    case 'boolean': return 'mdi-check'
    default: return 'mdi-help'
  }
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

export const useSchema = () => ({
  optionsForSchema,
  getTypeFor,
  iconForType,
  defaultValueForSchema,
})
