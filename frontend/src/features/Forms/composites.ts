import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import { TSchema } from '@feathersjs/typebox'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { AnyData, T18N } from '@/shared/interfaces/commons'
import { components, componentForType } from '@/features/Components'
import useValidators from '@/features/Validation/composites'

const validators = useValidators()

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

export default () => ({
  componentForType,

  components,

  newNameForField: (type: string, fields: AnyData[]): string => {
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
  },

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

  schemaForType: (f: TFormField | TFormColumn): TSchema | undefined => (
    // eslint-disable-next-line no-underscore-dangle
    components.find((c) => c.type === f._type)?.schema
  ),

  // eslint-disable-next-line no-underscore-dangle
  isRow: (field: TFormField): boolean => field._type === 'row',

  // eslint-disable-next-line no-underscore-dangle
  isCard: (field: TFormField): boolean => field._type === 'card',

  // eslint-disable-next-line no-underscore-dangle
  isParagraph: (field: TFormField): boolean => field._type === 'paragraph',

  serializeRules: (t: T18N, field: TFormField): ((...args) => (val: string) => true | string)[] => (
    (field.rules as AnyData[])?.map((r) => validators[r.type](t, omit(r, ['type'])))
  ),

  isNumericInput: (field: TFormField): boolean => {
    // eslint-disable-next-line no-underscore-dangle
    const comp = components.find((c) => c.type === field._type)
    if (comp) {
      if (typeof comp.numericInput === 'function') {
        return comp.numericInput(field)
      }
      return comp.numericInput
    }
    return false
  },

  style: (field: AnyData): AnyData => {
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
  },
})
