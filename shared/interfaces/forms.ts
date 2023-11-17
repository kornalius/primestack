import { Static, TSchema } from '@feathersjs/typebox'
import { fieldSchema } from '../schemas/form'
import { tableFieldSchema } from '../schemas/table'
import { AnyData } from './commons'

type FormField = Static<typeof fieldSchema>
type TableField = Static<typeof tableFieldSchema>

export interface PropName {
  label: string
  name: string
  icon?: string
  color?: string
  sectionColor?: string
  tooltip?: string
  children?: (PropName | string)[]
}

export interface TFormFieldCategory {
  icon: string
  names: (PropName | string)[]
}

export type EventArgsFn = (...args: unknown[]) => AnyData

export type EventArgs = Record<string, EventArgsFn>

export interface TFormComponent {
  // unique type for the component
  type: string
  // use the component as a row or card
  row?: boolean
  // use the component as a col or card-section
  col?: boolean
  // label for the component
  label: string | ((value?: AnyData) => string)
  // color for separator
  color?: string | ((value?: AnyData) => string)
  // component to use
  component?: unknown
  // check if the component is disabled
  disabled?: () => boolean
  // component classes to apply while editing
  classes?: AnyData
  // component styles to apply while editing
  styles?: AnyData
  // form-element classes to apply while editing
  elementClasses?: AnyData
  // form-element styles to apply while editing
  elementStyles?: AnyData
  // apply some classes to the overlay while editing
  overlayClasses?: AnyData
  // apply some styling to the overlay while editing
  overlayStyles?: AnyData
  // icon for the component
  icon: string | ((value?: AnyData) => string)
  // don't create a key for preview data
  nokey?: boolean
  // should we hide the component from the palette?
  hidden?: boolean
  // component properties schema
  schema?: TSchema
  // default values for properties
  defaultValues?: AnyData
  // edit mode classes to add to component
  editClasses?: AnyData
  // edit mode styles to add to component
  editStyles?: AnyData
  // overrides from field names (key) to display label values (value)
  labels?: AnyData
  // split schema keys into different categories and order items in the properties list
  categories?: Record<string, TFormFieldCategory>
  // use an horizontal layout for properties
  horizontal?: boolean
  // use an horizontal layout for properties in a popup editing
  horizontalPopup?: boolean
  // can you desactivate the drag & drop to play with the component?
  interactable?: boolean
  // for input fields (v-model), convert the value to numeric and not string
  numericInput?: boolean | ((field: FormField) => boolean)
  // map event arguments to context
  eventArgs?: EventArgs
  // specify the modelValue property when no "field" is used
  modelValueField?: string
  // what fields does this component provide?
  fields?: (field: FormField, editor: AnyData, ctx: AnyData) => TableField[]
}
