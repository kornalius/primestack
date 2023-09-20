import { Static, TSchema } from '@feathersjs/typebox'
import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { AnyData, T18N } from '@/shared/interfaces/commons'
import { components, componentForType, componentForField } from '@/features/Components'
import { useValidators } from '@/features/Validation/composites'
import { getTypeFor } from '@/shared/schema'
import { flattenFields, newNameForField } from '@/shared/form'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { useAppEditor } from '@/features/App/editor-store'
import { actionSchema } from '@/shared/schemas/actions'
import { tableFieldSchema } from '@/shared/schemas/table'

type TableField = Static<typeof tableFieldSchema>

type Action = Static<typeof actionSchema>

const validators = useValidators()

export const useFormElements = () => ({
  componentForField,

  componentForType,

  components,

  newNameForField,

  flattenFields,

  fieldBinds: (field: TFormField | TFormColumn, schema: TSchema, ctx: AnyData): AnyData => {
    const fieldsToOmit = [
      '_id',
      'name',
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
        let fieldname = k
        // if (ctx.editor.active) {
        //   return { ...acc, [k]: field[k] }
        // }
        // if it's an action, use onXxxx event key names instead
        if (schema.properties[k] && getTypeFor(schema.properties[k]) === 'action') {
          return { ...acc, [`on${startCase(k)}`]: callEventAction(field[k] as string) }
        }
        // schema property specifies its own prop name
        if (schema.properties[k] && schema.properties[k].propname) {
          fieldname = schema.properties[k].propname
        }
        return { ...acc, [fieldname]: getProp(field[k], ctx) }
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
  isIcon: (field: TFormField): boolean => field._type === 'icon',

  // eslint-disable-next-line no-underscore-dangle
  isTable: (field: TFormField): boolean => field._type === 'table',

  // eslint-disable-next-line no-underscore-dangle
  isParagraph: (field: TFormField): boolean => field._type === 'paragraph',

  // eslint-disable-next-line no-underscore-dangle
  isLabel: (field: TFormField): boolean => field._type === 'label',

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

    const b = field.border

    let border = ''
    if (b) {
      border = `${b.width}px ${b.style} ${b.color}`
    }

    const tl = b?.radius?.topLeft ? `${b?.radius?.topLeft}px` : '0'
    const tr = b?.radius?.topRight ? `${b?.radius?.topRight}px` : '0'
    const br = b?.radius?.bottomLeft ? `${b?.radius?.bottomLeft}px` : '0'
    const bl = b?.radius?.bottomRight ? `${b?.radius?.bottomRight}px` : '0'

    return {
      paddingTop: field.padding?.top,
      paddingLeft: field.padding?.left,
      paddingBottom: field.padding?.bottom,
      paddingRight: field.padding?.right,
      marginTop: field.margin?.top,
      marginLeft: field.margin?.left,
      marginBottom: field.margin?.bottom,
      marginRight: field.margin?.right,
      borderTop: b?.sides?.top ? border : 'none',
      borderBottom: b?.sides?.bottom ? border : 'none',
      borderLeft: b?.sides?.left ? border : 'none',
      borderRight: b?.sides?.right ? border : 'none',
      borderRadius: `${tl} ${tr} ${bl} ${br}`,
      ...(component.editStyles || {}),
    }
  },

  autoGenerateForm: (tableId: string): void => {
    const editor = useAppEditor()

    const addFieldToForm = (type: string, f: TableField, options?: AnyData): TFormField => {
      const component = components.find((c) => c.type === type)
      const field = editor.addFieldToForm(component, options)
      field.field = f.name
      field.label = f.name
      field.disable = f.readonly
      field.readonly = f.readonly
      return field
    }

    const table = editor.tableInstance(tableId)
    if (table) {
      table.fields
        .filter((f) => f.hidden !== true)
        .forEach((f) => {
          // if field is reference to another field in a table
          if (f.refTableId) {
            addFieldToForm('lookup-field', f, {
              columns: f.refFields.map((fc) => ({
                field: fc,
                filterable: true,
                titleClass: 'text-bold',
              })),
              multiple: f.array,
            })
            return
          }

          switch (f.type) {
            case 'string':
              addFieldToForm('input', f)
              break
            case 'number':
              addFieldToForm('input', f, { type: 'number' })
              break
            case 'boolean':
              addFieldToForm('checkbox', f)
              break
            case 'date':
              addFieldToForm('date', f)
              break
            case 'time':
              addFieldToForm('time', f)
              break
            case 'color':
              addFieldToForm('color', f)
              break
            case 'icon':
              addFieldToForm('iconSelect', f)
              break
            case 'objectid':
              addFieldToForm('select', f, { optionLabel: 'name', optionValue: '_id' })
              break
            default:
          }
        })
    }
  },
})
