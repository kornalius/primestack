import startCase from 'lodash/startCase'
import { Static } from '@feathersjs/typebox'
import { AnyData } from './interfaces/commons'
import { columnSchema, fieldSchema } from './schemas/form'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

export const flattenFields = (fields: FormField[] | FormColumn[]): FormField[] => {
  const flattended: FormField[] | FormColumn[] = []

  const flatten = (list: FormField[] | FormColumn[]): void => {
    list.forEach((f) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flattended.push(f as any)

      // eslint-disable-next-line no-underscore-dangle
      const cols = (f as FormField)._columns
      if (cols) {
        flatten(cols)
      }

      // eslint-disable-next-line no-underscore-dangle
      const flds = (f as FormColumn)._fields
      if (flds) {
        flatten(flds)
      }
    })
  }

  flatten(fields)

  return flattended
}

export const newNameForField = (type: string, fields: AnyData[]): string => {
  let index = 1
  let newName = `${startCase(type)}${index}`.toLowerCase()
  let field = fields.find((f) => f.name.toLowerCase() === newName)
  while (field) {
    index += 1
    newName = `${startCase(type)}${index}`.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-loop-func,no-loop-func
    field = fields.find((f) => f.name.toLowerCase() === newName)
  }
  return `${startCase(type)}${index}`
}
