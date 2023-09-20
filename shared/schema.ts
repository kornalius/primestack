import { Static, TSchema, Type } from '@feathersjs/typebox'
import { tableFieldSchema, tableIndexSchema } from './schemas/table'
import { AnyData } from './interfaces/commons'

type TableFieldSchema = Static<typeof tableFieldSchema>
type TableIndexSchema = Static<typeof tableIndexSchema>

export interface Index {
  fields: Record<string, number>
  unique?: boolean
  sparse?: boolean
  expireAfterSeconds?: number
}

/**
 * Retrieve possible options from the schema definition
 *
 * @param p Schema
 *
 * @returns {unknown[]} Options array
 */
export const optionsForSchema = (p: TSchema): unknown[] => {
  if (p.enum) {
    return p.enum.map((e: string) => ({ label: e, value: e }))
  }
  if (p.items?.enum) {
    return p.items.enum.map((e: string) => ({ label: e, value: e }))
  }
  return p.options || p.items?.options
}

/**
 * Extract the type of a schema field
 *
 * @param p Schema
 * @param forcedType Type being forced by the user
 *
 * @returns {string | undefined} Type string
 */
export const getTypeFor = (p: TSchema, forcedType?: string): string | undefined => {
  if (!p) {
    return undefined
  }

  const options = optionsForSchema(p)

  if (forcedType) {
    return forcedType
  }

  // Number field with a slider (optional properties: min, max, step)
  if (p.type === 'number' && p.slider) {
    return 'slider'
  }
  // Regular numberic input field (optional properties: min, max, step)
  if (p.type === 'number') {
    return 'number'
  }

  // Field selector dropdown, (optional properties: tableProp)
  if (p.type === 'string' && p.field === true) {
    return 'field'
  }
  // Table id selector
  if (p.type === 'string' && p.objectid === true && p.tableid === true) {
    return 'tableid'
  }
  // Action id selector
  if (p.type === 'string' && p.objectid === true && p.action === true) {
    return 'action'
  }
  // Service selector (optional properties: service, query)
  if (p.type === 'string' && p.objectid === true) {
    return 'objectid'
  }
  // Date picker
  if (p.type === 'string' && p.format === 'date') {
    return 'date'
  }
  // Time picker
  if (p.type === 'string' && p.format === 'time') {
    return 'time'
  }
  // Button toggles (optional properties: multiple)
  if (p.type === 'string' && Array.isArray(options) && p.toggles === true) {
    return 'toggles'
  }
  // Select dropdown (single selection)
  if (p.type === 'string' && Array.isArray(options)) {
    return 'select'
  }
  // Variable selector
  if (p.type === 'string' && p.variable) {
    return 'variable'
  }
  // Color picker
  if (p.type === 'string' && p.color) {
    return 'color'
  }
  // Icon selector
  if (p.type === 'string' && p.icon) {
    return 'icon'
  }
  // Expression editor
  if (p.type === 'string' && p.expr) {
    return 'expr'
  }
  // Regular text input
  if (p.type === 'string') {
    return 'string'
  }

  // Checkbox
  if (p.type === 'boolean') {
    return 'boolean'
  }

  // JSON array editor
  if (p.type === 'array' && p.json === true) {
    return 'json'
  }
  // Multiselect dropdown
  if (p.type === 'array' && p.items?.type === 'string' && (Array.isArray(options) || p.enum)) {
    return 'select'
  }
  // Multiselect fields dropdown (optional properties: tableProp)
  if (p.type === 'array' && p.items?.type === 'string' && p.field && p.select) {
    return 'select-field'
  }
  // Array editor
  if (p.type === 'array') {
    return 'array'
  }

  // Query editor
  if (p.type === 'object' && p.query === true) {
    return 'query'
  }
  // JSON editor
  if (p.type === 'object' && p.json === true) {
    return 'json'
  }
  // Padding editor
  if (p.type === 'object' && p.padding) {
    return 'padding'
  }
  // Margin editor
  if (p.type === 'object' && p.margin) {
    return 'margin'
  }
  // Border editor
  if (p.type === 'object' && p.border) {
    return 'border'
  }
  // Object editor
  if (p.type === 'object') {
    return 'object'
  }

  if (p.anyOf) {
    return getTypeFor(p.anyOf[0])
  }

  return 'string'
}

/**
 * List of field types that can be converted to an expression
 */
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
  'expr',
]

/**
 * Get the alignment for a column in a table based on its field type
 *
 * @param type Field type
 *
 * @returns {string} Alignment
 */
export const columnAlignmentFor = (type: string): string => {
  if (type === 'boolean') {
    return 'center'
  }
  if (type === 'number') {
    return 'right'
  }
  return 'left'
}

/**
 * Get a default value for a field schema
 *
 * @param schema Field schema
 * @param forcedType Type forced by the user
 *
 * @returns {unknown} Default value
 */
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

/**
 * Create an object with default values for each key
 *
 * @param values Object
 *
 * @returns {AnyData | undefined} Object with default values
 */
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

/**
 * Omit fields
 *
 * @param obj Object
 * @param props Property names to omit
 *
 * @returns {AnyData} New object with the properties
 */
const omit = (obj: AnyData, props: string[]): AnyData => {
  const result = { ...obj }
  props.forEach((prop) => {
    delete result[prop]
  })
  return result
}

/**
 * Omit fields from a schema
 *
 * @param schema Schema
 * @param fields Field names to omit
 *
 * @returns {TSchema} New schema with properties
 */
export const omitFields = (schema: TSchema, fields: string[]): TSchema => ({
  ...schema,
  properties: omit(schema.properties, fields),
})

/**
 * Returns a default icon for a field type
 *
 * @param type Field type
 *
 * @returns {string} Icon name
 */
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

/**
 * Display class for a field
 *
 * @param name Name of the field
 *
 * @returns {string} Quasar class string
 */
export const fieldClass = (name: string): string => {
  const fields = [
    '_id',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
    'deletedAt',
    'deletedBy',
  ]

  return fields.includes(name) ? 'text-italic' : 'text-bold'
}

/**
 * Returns a type from a JSON object value
 *
 * @param o Object to check type from
 *
 * @returns {string} Type of 'o'
 */
export const primaryToType = (o: unknown): string => {
  const t = typeof o

  if (Array.isArray(o)) {
    return 'array'
  }

  if (['string', 'number', 'boolean', 'object'].includes(t)) {
    return t
  }

  return 'string'
}

/**
 * Convert a Table field into a JSON Schema
 *
 * @param field Table field
 *
 * @returns {TSchema} JSON Schema for the field
 */
export const fieldToSchema = (field: TableFieldSchema): TSchema => {
  if (field.array) {
    const a = Type.Array(fieldToSchema({
      ...field,
      array: false,
    } as TableFieldSchema))
    return field.optional ? Type.Optional(a) : a
  }

  // if field is a reference to another field in another table
  if (field.refTableId) {
    if (field.array) {
      const a = Type.Array(Type.String({ objectid: true }))
      return field.optional ? Type.Optional(a) : a
    }

    const s = Type.String({ objectid: true })
    return field.optional ? Type.Optional(s) : s
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
      return field.optional ? Type.Optional(s) : s

    case 'boolean':
      // eslint-disable-next-line no-case-declarations
      const b = Type.Boolean({})
      return field.optional ? Type.Optional(b) : b

    case 'number':
      // eslint-disable-next-line no-case-declarations
      const n = Type.Number({
        slider: field.slider,
        minimum: field.min,
        maximum: field.max,
        exclusiveMinimum: field.exclusiveMin,
        exclusiveMaximum: field.exclusiveMax,
      })
      return field.optional ? Type.Optional(n) : n

    case 'date':
      // eslint-disable-next-line no-case-declarations
      const d = Type.String({
        format: 'date',
        formatMinimum: field.dateMin,
        formatMaximum: field.dateMax,
        exclusiveMinimum: field.dateExclusiveMin,
        exclusiveMaximum: field.dateExclusiveMax,
      })
      return field.optional ? Type.Optional(d) : d

    case 'time':
      // eslint-disable-next-line no-case-declarations
      const t = Type.String({
        format: 'time',
        formatMinimum: field.dateMin,
        formatMaximum: field.dateMax,
        exclusiveMinimum: field.dateExclusiveMin,
        exclusiveMaximum: field.dateExclusiveMax,
      })
      return field.optional ? Type.Optional(t) : t

    case 'color':
      // eslint-disable-next-line no-case-declarations
      const c = Type.String({
        color: true,
      })
      return field.optional ? Type.Optional(c) : c

    case 'icon':
      // eslint-disable-next-line no-case-declarations
      const i = Type.String({
        icon: true,
      })
      return field.optional ? Type.Optional(i) : i

    case 'select':
      // eslint-disable-next-line no-case-declarations
      const e = Type.String({
        options: field.options,
      })
      return field.optional ? Type.Optional(e) : e

    default:
      return field.optional ? Type.Optional(Type.String()) : Type.String()
  }
}

/**
 * Converts multiple Table fields into a JSON Schema
 *
 * @param fields Table fields
 * @param id JSON Schema $id
 *
 * @returns {TSchema} New JSON Schema
 */
export const fieldsToSchema = (fields: TableFieldSchema[], id: string): TSchema => (
  Type.Object((fields || []).reduce((acc, f) => ({
    ...acc,
    [f.name]: fieldToSchema(f),
  }), {}), { $id: id })
)

/**
 * Converts Table indexes into valid mongo indexes
 *
 * @param indexes Table indexes
 *
 * @returns {Index[]} Indexes usable for mongo table definition
 */
export const indexesToMongo = (indexes: TableIndexSchema[]): Index[] => (
  indexes.map((i) => ({
    fields: { [i.name]: i.order },
    unique: i.unique,
    sparse: i.sparse,
  }))
)

/**
 * Takes a field name and convert it into a reference field
 *
 * @param name Field name
 *
 * @returns {string} Reference field name
 */
export const refFieldname = (name: string): string => {
  let n = name || 'Undefined'
  if (n.endsWith('Id')) {
    n = n.substring(0, n.length - 2)
  }
  return `${n}Ref`
}
