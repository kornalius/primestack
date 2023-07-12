import { TSchema } from '@feathersjs/typebox'

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
