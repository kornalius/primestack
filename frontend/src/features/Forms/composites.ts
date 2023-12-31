import hexObjectId from 'hex-object-id'
import { Static, TSchema } from '@feathersjs/typebox'
import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import { EventArgs, EventArgsFn, TFormComponent } from '@/shared/interfaces/forms'
import { AnyData, T18N } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import {
  components,
  componentForType,
  componentForField,
  componentsByType,
} from '@/features/Components'
import { useValidators } from '@/features/Validation/composites'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/Editor/store'
import { useFeathersService } from '@/composites/feathers'
import { defaultValueForSchema, defaultValues, getTypeFor } from '@/shared/schema'
import { flattenFields, parentFormField } from '@/shared/form'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { generateFormField } from '@/features/Tables/composites'
import { newName } from '@/shared/utils'
import { queryToMongo } from '@/features/Query/composites'
import { actionElementSchema, actionSchema } from '@/shared/schemas/actions'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { columnSchema, fieldSchema, formSchema } from '@/shared/schemas/form'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'

type TableField = Static<typeof tableFieldSchema>
type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type Action = Static<typeof actionSchema>
type Table = Static<typeof tableSchema>

const validators = useValidators()

export const classSizes = ['xs', 'sm', 'md', 'lg', 'xl']

/**
 * Returns the event arguments for a field action
 *
 * @param type Component type
 *
 * @returns {EventArgs|undefined}
 */
export const eventArgsForField = (type: string): EventArgs | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[type]?.eventArgs
)

/**
 * Returns the argument keys for a field event
 *
 * @param type Component type
 * @param name Name of event
 *
 * @returns {string[]}
 */
export const argNames = (type: string, name: string): string[] => {
  const eventArgsFn = eventArgsForField(type)?.[name]
  if (eventArgsFn) {
    return Object.keys(eventArgsFn({}))
  }
  return []
}

/**
 * Returns true if field is a row
 *
 * @param field Field
 *
 * @returns {boolean}
 */
export const isRow = (field: FormField | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'row'
    || (field as TFormComponent).type === 'row'
)

/**
 * Returns true if field is a list
 *
 * @param field Field
 *
 * @returns {boolean}
 */
export const isList = (field: FormField | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'list'
    || (field as TFormComponent).type === 'list'
)

/**
 * Returns true if field is a toolbar
 *
 * @param field Field
 *
 * @returns {boolean}
 */
export const isToolbar = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'toolbar'
    || (field as TFormComponent).type === 'toolbar'
)

/**
   * Returns true if field is tabs
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isTabs = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'tabs'
    || (field as TFormComponent).type === 'tabs'
)

/**
   * Returns true if field is a card
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isCard = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'card'
    || (field as TFormComponent).type === 'card'
)

/**
 * Returns true if field is a card-section
 *
 * @param field Field
 *
 * @returns {boolean}
 */
export const isCardSection = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'card-section'
    || (field as TFormComponent).type === 'card-section'
)

/**
 * Returns true if field is a card-actions
 *
 * @param field Field
 *
 * @returns {boolean}
 */
export const isCardActions = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'card-actions'
    || (field as TFormComponent).type === 'card-actions'
)

/**
   * Returns true if field is an embedded form
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isEmbeddedForm = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'form-embedded'
    || (field as TFormComponent).type === 'form-embedded'
)

/**
   * Returns true if field is an icon
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isIcon = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'icon'
    || (field as TFormComponent).type === 'icon'
)

/**
   * Returns true if field is a sidebar
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isSidebar = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'sidebar'
    || (field as TFormComponent).type === 'sidebar'
)

/**
   * Returns true if field is a table
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isTable = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'table'
    || (field as TFormComponent).type === 'table'
)

/**
   * Returns true if field is a paragraph
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isParagraph = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'paragraph'
    || (field as TFormComponent).type === 'paragraph'
)

/**
   * Returns true if field is a label
   *
   * @param field Field
   *
   * @returns {boolean}
   */
export const isLabel = (field: FormField | FormColumn | TFormComponent): boolean => (
  // eslint-disable-next-line no-underscore-dangle
  (field as FormField)._type === 'label'
    || (field as TFormComponent).type === 'label'
)

/**
 * Find the parent form for a field
 *
 * @param field Field to get the parent form for
 *
 * @returns {Form | undefined}
 */
export const parentForm = (field: FormField | FormColumn): Form | undefined => {
  const userForm = useFeathersService('forms').findOneInStore({ query: {} })
  return userForm.value?.list.find((f: Form) => parentFormField(f, field))
}

/**
 * Returns the path of elements from a form leading to an element
 *
 * @param form Form instance
 * @param field Field instance to look for
 *
 * @returns {FormField[]|undefined}
 */
export const pathTo = (form: Form, field: FormField): FormField[] | undefined => {
  const scanColumn = (columns: FormColumn[], path: FormField[]): FormField[] | undefined => {
    // eslint-disable-next-line no-underscore-dangle
    for (let i = 0; i < columns.length; i++) {
      const c = columns[i]

      // eslint-disable-next-line no-underscore-dangle
      const fields = c._fields

      for (let y = 0; y < fields.length; y++) {
        const f = fields[y]

        if (f._id === field._id) {
          return [...path, field as FormField]
        }

        // eslint-disable-next-line no-underscore-dangle
        const cols = f._columns
        if (cols) {
          const pp = scanColumn(cols, [...path, f as FormField])
          if (pp) {
            return pp
          }
        }
      }
    }
    return undefined
  }

  // eslint-disable-next-line no-underscore-dangle
  for (let i = 0; i < form?._fields.length || 0; i++) {
    // eslint-disable-next-line no-underscore-dangle
    const fields = form._fields

    const f = fields[i]

    if (f._id === field._id) {
      return [field]
    }

    // eslint-disable-next-line no-underscore-dangle
    const cols = f._columns
    if (cols) {
      const pp = scanColumn(cols, [f])
      if (pp) {
        return pp
      }
    }
  }

  return undefined
}

/**
 * Call an event action (exec function)
 *
 * @param id Id of the action
 * @param ctx Context
 * @param eventArgsFn Arguments to pass to the exec function
 */
export const callEventAction = (id: string, ctx: AnyData, eventArgsFn?: EventArgsFn) => (
  async (...args: unknown[]) => {
    const userActions = ctx.useFeathersService('actions')
      .findOneInStore({ query: {} })?.value?.list || []
    const act = userActions.find((a: Action) => a._id === id)
    if (act) {
      // eslint-disable-next-line no-underscore-dangle
      await ctx.exec(act._actions, {
        ...ctx,
        $scoped: eventArgsFn && eventArgsFn(...args),
      })
    }
  }
)

/**
 * Returns the class name for a column size
 *
 * @param column Column
 *
 * @returns {string}
 */
export const colName = (column: FormColumn): string => {
  const c = column as AnyData
  if (c.col === undefined || c.col === null || c.col === '') {
    return 'col'
  }
  return `col-${c.col}`
}

/**
 * Returns the class name for a offset size
 *
 * @param column Column
 *
 * @returns {string}
 */
export const offsetName = (column: FormColumn): string => {
  const c = column as AnyData
  if (c.offset === undefined || c.offset === null || c.offset === '') {
    return 'offset'
  }
  return `offset-${c.offset}`
}

/**
 * Returns the class name for a column breakpoint name
 *
 * @param column Column
 *
 * @returns {string}
 */
export const colBreakName = (column: FormColumn): string => {
  const c = column as AnyData
  if (c.breakpoint === undefined || c.breakpoint === null || c.breakpoint === '') {
    return 'col'
  }
  if (c.breakpointCol === undefined || c.breakpointCol === null || c.breakpointCol === '') {
    return `col-${c.breakpoint}`
  }
  return `col-${c.breakpoint}-${c.breakpointCol}`
}

/**
 * Get the schema from an object _internalType
 *
 * @param o Object
 *
 * @returns {TSchema|undefined}
 */
export const getSchema = (o: AnyData): TSchema | undefined => {
  // eslint-disable-next-line no-underscore-dangle
  switch (o._internalType) {
    case 'action': return actionSchema
    case 'action-element': return actionElementSchema
    case 'menu': return menuSchema
    case 'tab': return tabSchema
    case 'form': return formSchema
    // eslint-disable-next-line no-underscore-dangle
    case 'field': return componentsByType[(o as FormField | FormColumn)._type]
    case 'table': return tableSchema
    case 'table-field': return tableFieldSchema
    default: return undefined
  }
}

/**
 * Creates a new form instance
 *
 * @param forms Array of form instances
 * @param options Optional options
 *
 * @returns {Form}
 */
export const newForm = (forms: Form[], options?: AnyData): Form => ({
  _id: hexObjectId(),
  _internalType: 'form',
  name: newName('form', forms),
  _fields: [],
  ...(options || {}),
})

/**
 * Create a new form field
 *
 * @param type Type of component
 * @param fields Array of fields instance
 * @param options Optional options
 *
 * @return {FormField|undefined}
 */
export const newFormField = (
  type: string,
  fields: FormField[],
  options?: AnyData,
): FormField | undefined => {
  const component = componentsByType[type]
  if (component) {
    return {
      _id: hexObjectId(),
      _internalType: 'field',
      _type: component.type,
      _columns: component.row ? [] : undefined,
      _fields: component.col ? [] : undefined,
      ...Object.keys(component.schema?.properties || {})
        .reduce((acc, k) => (
          { ...acc, [k]: defaultValueForSchema(component.schema.properties[k]) }
        ), {}),
      ...(defaultValues(component.defaultValues) || {}),
      // eslint-disable-next-line no-underscore-dangle
      name: newName(component.type, fields),
      ...options,
    } as FormField
  }
  return undefined
}

/**
 * Creates a new column field
 *
 * @param type Type of component
 *
 * @returns {FormColumn|undefined}
 */
export const newColField = (type: string): FormColumn | undefined => {
  const component = componentsByType[type]

  if (component) {
    return {
      _id: hexObjectId(),
      _internalType: 'column',
      _type: type,
      _columns: undefined,
      _fields: [],
      size: undefined,
      ...Object.keys(component.schema?.properties || {})
        .reduce((acc, k) => (
          { ...acc, [k]: defaultValueForSchema(component.schema.properties[k]) }
        ), {}),
      ...(defaultValues(component.defaultValues) || {}),
    } as FormColumn
  }
  return undefined
}

export const useFormElements = () => ({
  componentForField,

  componentForType,

  componentsByType,

  components,

  flattenFields,

  callEventAction,

  /**
   * Returns an object that can be bound to a Vue Component (v-bind)
   *
   * @param field Field to bind
   * @param schema Schema for field
   * @param ctx Context
   * @param pick Only bind those fields
   *
   * @returns {AnyData}
   */
  fieldBinds: (field: FormField | FormColumn, schema: TSchema, ctx: AnyData, pick?: string[]): AnyData => {
    const editor = useAppEditor()

    const fieldsToOmit = [
      '_id',
      'name',
      '_type',
      '_internalType',
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
        // if a style field
        if (s.properties[k].style) {
          fieldsToOmit.push(k)
        }
        // if has picked fields and it's not one of them
        if (pick && !pick.includes(k)) {
          fieldsToOmit.push(k)
        }
      })
    }

    scanSchema(schema)

    return Object.keys(omit(field, fieldsToOmit))
      .reduce((acc, k) => {
        let fieldname = k
        const prop = schema.properties[k] as TSchema
        const type = prop && getTypeFor(prop)

        // if (ctx.editor.active) {
        //   return { ...acc, [k]: field[k] }
        // }

        // schema property specifies its own prop name
        if (prop && prop.propname) {
          fieldname = prop.propname
        }

        // if it's an action, use onXxxx event key names instead
        if (type === 'action') {
          // eslint-disable-next-line no-underscore-dangle
          const eventArgsFn = eventArgsForField(field._type)?.[k]
          return {
            ...acc,
            [`on${startCase(k)}`]: callEventAction(field[k] as string, ctx, eventArgsFn),
          }
        }

        if (type === 'query') {
          const { tableId } = (field as AnyData)

          if (editor.active) {
            const fieldTable = editor.tables
              .find((tbl: Table) => tbl._id === tableId)
            return {
              ...acc,
              [fieldname]: queryToMongo(field[k], fieldTable, ctx.$expr),
            }
          }

          const userTable = useFeathersService('tables')
            .findOneInStore({ query: {} })
          const fieldTable = userTable.value?.list
            .find((tt: Table) => tt._id === tableId)
          return {
            ...acc,
            [fieldname]: queryToMongo(field[k], fieldTable, ctx.$expr),
          }
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
  schemaForField: (f: Form | FormField | FormColumn): TSchema | undefined => {
    // eslint-disable-next-line no-underscore-dangle
    if ((f as Form)?._fields) {
      return formSchema
    }
    // eslint-disable-next-line no-underscore-dangle
    return componentsByType[(f as FormField | FormColumn)._type]?.schema
  },

  getSchema,

  colName,

  offsetName,

  colBreakName,

  isRow,

  isList,

  isToolbar,

  isTabs,

  isCard,

  isCardSection,

  isCardActions,

  isEmbeddedForm,

  isIcon,

  isSidebar,

  isTable,

  isParagraph,

  isLabel,

  eventArgsForField,

  argNames,

  parentForm,

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

  classSizes,

  /**
   * Returns a Vue Component Class bindable object
   *
   * @param field Field
   *
   * @returns {AnyData}
   */
  classBinds: (field: AnyData): AnyData => {
    const c: AnyData = {}

    // paddings

    if (classSizes.includes(field.padding?.top)) {
      c[`q-pt-${field.padding.top}`] = true
    }
    if (classSizes.includes(field.padding?.bottom)) {
      c[`q-pb-${field.padding.bottom}`] = true
    }
    if (classSizes.includes(field.padding?.left)) {
      c[`q-pl-${field.padding.left}`] = true
    }
    if (classSizes.includes(field.padding?.right)) {
      c[`q-pr-${field.padding.right}`] = true
    }

    // margins

    if (classSizes.includes(field.margin?.top)) {
      c[`q-mt-${field.margin.top}`] = true
    }
    if (classSizes.includes(field.margin?.bottom)) {
      c[`q-mb-${field.margin.bottom}`] = true
    }
    if (classSizes.includes(field.margin?.left)) {
      c[`q-ml-${field.margin.left}`] = true
    }
    if (classSizes.includes(field.margin?.right)) {
      c[`q-mr-${field.margin.right}`] = true
    }

    // shadows

    if (Number(field.shadow) >= 1 && Number(field.shadow) <= 24) {
      c[`shadow-${field.shadow}`] = true
    }

    return {
      ...c,
    }
  },

  /**
   * Returns a Vue Component bindable style object
   * for all the field's stylable properties
   *
   * @param field Field
   *
   * @returns {AnyData}
   */
  styleBinds: (field: AnyData): AnyData => {
    const b = field.border

    let border = ''
    if (b) {
      border = b.style !== 'none' && b.width > 0 && b.color
        ? `${b.width}px ${b.style} ${b.color}`
        : undefined
    }

    const radius = b?.radius as AnyData

    return {
      paddingTop: field.padding?.top,
      paddingLeft: field.padding?.left,
      paddingBottom: field.padding?.bottom,
      paddingRight: field.padding?.right,
      marginTop: field.margin?.top,
      marginLeft: field.margin?.left,
      marginBottom: field.margin?.bottom,
      marginRight: field.margin?.right,
      borderTop: b?.sides?.top ? border : undefined,
      borderBottom: b?.sides?.bottom ? border : undefined,
      borderLeft: b?.sides?.left ? border : undefined,
      borderRight: b?.sides?.right ? border : undefined,
      borderTopLeftRadius: radius?.topLeft,
      borderTopRightRadius: radius?.topRight,
      borderBottomLeftRadius: radius?.bottomLeft,
      borderBottomRightRadius: radius?.bottomRight,
      color: field.color,
      backgroundColor: field.backgroundColor,
      width: field.sizes?.width,
      height: field.sizes?.height,
      minWidth: field.sizes?.minWidth,
      maxWidth: field.sizes?.maxWidth,
      minHeight: field.sizes?.minHeight,
      maxHeight: field.sizes?.maxHeight,
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
          dense: true,
          outline: true,
        })
      }
      return undefined
    }

    const table = editor.tableInstance(tableId)
    if (table) {
      table.fields
        .filter((f) => f.hidden !== true)
        .forEach((f) => {
          generateFormField(f, addFieldToForm, table)
        })
    }
  },

  pathTo,

  newForm,

  newFormField,

  newColField,
})
