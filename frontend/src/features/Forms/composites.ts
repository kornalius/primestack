import { Static, TSchema } from '@feathersjs/typebox'
import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import { EventArgs, EventArgsFn } from '@/shared/interfaces/forms'
import { AnyData, T18N } from '@/shared/interfaces/commons'
import {
  components,
  componentForType,
  componentForField,
  componentsByType,
} from '@/features/Components'
import { useValidators } from '@/features/Validation/composites'
import { getTypeFor } from '@/shared/schema'
import { flattenFields, newNameForField } from '@/shared/form'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { useAppEditor } from '@/features/App/editor-store'
import { actionSchema } from '@/shared/schemas/actions'
import { tableFieldSchema } from '@/shared/schemas/table'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'

type TableField = Static<typeof tableFieldSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

type Action = Static<typeof actionSchema>

const validators = useValidators()

/**
 * Returns the event arguments for a field action
 *
 * @param f
 */
const eventArgsForField = (f: FormField | FormColumn): EventArgs | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[f._type]?.eventArgs
)

/**
 * Returns the argument keys for a field event
 *
 * @param f Field
 * @param name
 */
const argNames = (f: FormField | FormColumn, name: string): string[] => {
  const eventArgsFn = eventArgsForField(f)?.[name]
  if (eventArgsFn) {
    return Object.keys(eventArgsFn({}))
  }
  return []
}

export const useFormElements = () => ({
  componentForField,

  componentForType,

  componentsByType,

  components,

  newNameForField,

  flattenFields,

  /**
   * Returns an object that can be bound to a Vue Component (v-bind)
   *
   * @param field Field to bind
   * @param schema Schema for field
   * @param ctx Context
   *
   * @returns {AnyData}
   */
  fieldBinds: (field: FormField | FormColumn, schema: TSchema, ctx: AnyData): AnyData => {
    const fieldsToOmit = [
      '_id',
      'name',
      '_type',
      '_fields',
      '_columns',
      'modelValue',
    ]

    /**
     * Scan a schema for fields to omit from binding
     *
     * @param s Schema
     */
    const scanSchema = (s: TSchema): void => {
      Object.keys(s.properties).forEach((k) => {
        if (s.properties[k].style) {
          fieldsToOmit.push(k)
        }
      })
    }

    scanSchema(schema)

    const userActions = ctx.api.service('actions')
      .findOneInStore({ query: {} })?.value?.list || []

    /**
     * Call an event action (exec function)
     *
     * @param id Id of the action
     * @param eventArgsFn Arguments to pass to the exec function
     */
    const callEventAction = (id: string, eventArgsFn?: EventArgsFn) => (
      async (...args: unknown[]) => {
        const act = userActions.find((a: Action) => a._id === id)
        if (act) {
          // eslint-disable-next-line no-underscore-dangle
          await ctx.exec(act._actions, {
            ...ctx,
            $scoped: eventArgsFn(...args),
          })
        }
      }
    )

    return Object.keys(omit(field, fieldsToOmit))
      .reduce((acc, k) => {
        let fieldname = k
        const prop = schema.properties[k] as AnyData

        // if (ctx.editor.active) {
        //   return { ...acc, [k]: field[k] }
        // }

        // if it's an action, use onXxxx event key names instead
        if (prop && getTypeFor(schema.properties[k]) === 'action') {
          const eventArgsFn = eventArgsForField(field)?.[k]
          return {
            ...acc,
            [`on${startCase(k)}`]: callEventAction(field[k] as string, eventArgsFn),
          }
        }

        // schema property specifies its own prop name
        if (prop && prop.propname) {
          fieldname = prop.propname
        }

        return { ...acc, [fieldname]: getProp(field[k], ctx) }
      }, {})
  },

  /**
   * Returns a schema for a field
   *
   * @param f Field
   *
   * @returns {TSchema|undefined}
   */
  schemaForField: (f: FormField | FormColumn): TSchema | undefined => (
    // eslint-disable-next-line no-underscore-dangle
    componentsByType[f._type]?.schema
  ),

  eventArgsForField,

  argNames,

  /**
   * Returns true if field is a row
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line no-underscore-dangle
  isRow: (field: FormField): boolean => field._type === 'row',

  /**
   * Returns true if field is tabs
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line no-underscore-dangle
  isTabs: (field: FormField): boolean => field._type === 'tabs',

  /**
   * Returns true if field is a card
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line no-underscore-dangle
  isCard: (field: FormField): boolean => field._type === 'card',

  /**
   * Returns true if field is an icon
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line no-underscore-dangle
  isIcon: (field: FormField): boolean => field._type === 'icon',

  /**
   * Returns true if field is a table
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line no-underscore-dangle
  isTable: (field: FormField): boolean => field._type === 'table',

  /**
   * Returns true if field is a paragraph
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line no-underscore-dangle
  isParagraph: (field: FormField): boolean => field._type === 'paragraph',

  /**
   * Returns true if field is a label
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line no-underscore-dangle
  isLabel: (field: FormField): boolean => field._type === 'label',

  /**
   * Serialize field's rules to bind to Quasar Inputs
   *
   * @param t i18next function
   * @param field Field
   *
   * @returns {((...args: any[]) => (val: string) => true | string)[]}
   */
  serializeRules: (
    t: T18N,
    field: FormField,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): ((...args: any[]) => (val: string) => true | string)[] => (
    ((field as AnyData).rules as AnyData[])?.map((r) => (
      validators[r.type](t, omit(r, ['type']))
    ))
  ),

  /**
   * Returns true if the field is considered a numeric input
   * It returns the 'numericInput' or calls it if a function
   * from the TFormComponent of the 'field._type'
   *
   * @param field Field
   *
   * @returns {boolean}
   */
  isNumericInput: (field: FormField): boolean => {
    // eslint-disable-next-line no-underscore-dangle
    const comp = componentsByType[field._type]
    if (comp) {
      if (typeof comp.numericInput === 'function') {
        return comp.numericInput(field)
      }
      return comp.numericInput
    }
    return false
  },

  /**
   * Returns a Vue Component bindable style object
   * for all the field's stylable properties
   *
   * @param field Field
   *
   * @returns {AnyData}
   */
  style: (field: AnyData): AnyData => {
    // eslint-disable-next-line no-underscore-dangle
    const component = componentsByType[field._type]

    const b = field.border

    let border = ''
    if (b) {
      border = `${b.width}px ${b.style} ${b.color}`
    }

    const radius = b?.radius as AnyData
    const tl = radius?.topLeft || '0'
    const tr = radius?.topRight || '0'
    const br = radius?.bottomLeft || '0'
    const bl = radius?.bottomRight || '0'

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
      color: field.color,
      backgroundColor: field.backgroundColor,
      ...(component.editStyles || {}),
    }
  },

  /**
   * Automatically fill with inputs the current form being edited from a table
   *
   * @param tableId Id of the table
   */
  autoGenerateForm: (tableId: string): void => {
    const editor = useAppEditor()

    const addFieldToForm = (
      type: string,
      f: TableField,
      options?: AnyData,
    ): FormField | FormColumn | undefined => {
      const component = componentsByType[type]
      if (component) {
        return editor.addFieldToForm(component, {
          ...options,
          field: f.name,
          label: f.name,
          disable: f.readonly,
          readonly: f.readonly,
        })
      }
      return undefined
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
              addFieldToForm('select', f, {
                optionLabel: 'name',
                optionValue: '_id',
              })
              break
            default:
          }
        })
    }
  },
})
