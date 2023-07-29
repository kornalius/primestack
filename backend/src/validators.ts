// For more information about this file see https://dove.feathersjs.com/guides/cli/validators.html
import { keywordObjectId } from '@feathersjs/mongodb'
import { Ajv, addFormats, FormatsPluginOptions } from '@feathersjs/schema'
// eslint-disable-next-line import/no-cycle
import { reservedFields } from './service'

export const ajv = new Ajv({
  strictSchema: false,
})

export const availableFieldname = {
  keyword: 'availableFieldname',
  type: 'string',
  validate: (schema: unknown, data: string): boolean => !reservedFields.includes(data),
} as const

const formats: FormatsPluginOptions = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
  'duration',
  'byte',
  'int32',
  'int64',
  'float',
  'double',
  'password',
  'binary',
]

export const dataValidator: Ajv = addFormats(ajv, formats)

export const queryValidator: Ajv = addFormats(
  new Ajv({
    coerceTypes: true,
    strictSchema: false,
  }),
  formats
)

dataValidator.addKeyword(keywordObjectId)
dataValidator.addKeyword(availableFieldname)

queryValidator.addKeyword(keywordObjectId)
