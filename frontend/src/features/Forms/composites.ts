import { Static, TSchema } from '@feathersjs/typebox'
import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { AnyData, T18N } from '@/shared/interfaces/commons'
import { components, componentForType, componentForField } from '@/features/Components'
import { useValidators } from '@/features/Validation/composites'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import { getTypeFor } from '@/shared/schema'
import { actionSchema } from '@/shared/schemas/actions'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type Action = Static<typeof actionSchema>

const validators = useValidators()

const flattenFields = (fields: FormField[] | FormColumn[]): FormField[] => {
  const flattended = []

  const flatten = (list: FormField[] | FormColumn[]): void => {
    list.forEach((f: FormField | FormColumn) => {
      flattended.push(f)

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

export const useFormElements = () => ({
  componentForField,

  componentForType,

  components,

  newNameForField,

  flattenFields,

  fieldBinds: (field: TFormField | TFormColumn, schema: TSchema, ctx: AnyData): AnyData => {
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
        }
      })
    }

    scanSchema(schema)

    const userActions = ctx.api.service('actions').findOneInStore({ query: {} })?.value?.list || []

    const callEventAction = (id: string) => async () => {
      const act = userActions.find((a: Action) => a._id === id)
      if (act) {
        // eslint-disable-next-line no-underscore-dangle
        await ctx.exec(act._actions, ctx)
      }
    }

    return Object.keys(omit(field, fieldsToOmit))
      .reduce((acc, k) => {
        // if (ctx.editor.active) {
        //   return { ...acc, [k]: field[k] }
        // }
        // if it's an action, use onXxxx event key names instead
        if (schema.properties[k] && getTypeFor(schema.properties[k]) === 'action') {
          return { ...acc, [`on${startCase(k)}`]: callEventAction(field[k] as string) }
        }
        return { ...acc, [k]: getProp(field[k], ctx) }
      }, {})
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serializeRules: (t: T18N, field: TFormField): ((...args: any[]) => (val: string) => true | string)[] => (
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
