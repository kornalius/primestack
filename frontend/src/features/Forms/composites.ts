import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import { TSchema } from '@feathersjs/typebox'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import { components, componentForType } from '@/features/Components'

const newNameForField = (type: string, fields: AnyData[]): string => {
  let index = 1
  let newName = `${startCase(type)}${index}`
  let field = fields.find((f) => f.name === newName)
  while (field) {
    index += 1
    newName = `${startCase(type)}${index}`
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    field = fields.find((f) => f.name === newName)
  }
  return newName
}

const flattenFields = (fields: TFormField[]): (AnyData)[] => {
  const flattended = []

  const flatten = (list: AnyData[]): void => {
    list.forEach((f) => {
      flattended.push(f)

      // eslint-disable-next-line no-underscore-dangle
      const cols = f._columns
      if (cols) {
        flatten(cols)
      }

      // eslint-disable-next-line no-underscore-dangle
      const flds = f._fields
      if (flds) {
        flatten(flds)
      }
    })
  }

  flatten(fields)

  return flattended
}

const style = (field: AnyData): AnyData => {
  const component = components
    // eslint-disable-next-line no-underscore-dangle
    .find((c) => c.type === field._type)
  return {
    paddingTop: field.padding?.top,
    paddingLeft: field.padding?.left,
    paddingBottom: field.padding?.bottom,
    paddingRight: field.padding?.right,
    marginTop: field.margin?.top,
    marginLeft: field.margin?.left,
    marginBottom: field.margin?.bottom,
    marginRight: field.margin?.right,
    ...(component.editStyles || {}),
  }
}

export default () => ({
  flattenFields,

  fieldBinds: (field: TFormField | TFormColumn, schema: TSchema): AnyData => {
    const fieldsToOmit = [
      '_id',
      '_type',
      '_fields',
      '_columns',
      'modelValue',
    ]

    const scanSchema = (s: TSchema): void => {
      Object.keys(s.properties).forEach((k) => {
        if (s.properties[k].style) {
          fieldsToOmit.push(k)
        } else if (s.properties[k].type === 'object') {
          scanSchema(s.properties[k])
        }
      })
    }

    scanSchema(schema)

    return omit(field, fieldsToOmit)
  },

  componentForType,

  components,

  style,
})
