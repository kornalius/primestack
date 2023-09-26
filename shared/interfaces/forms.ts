import { Static, TSchema } from '@feathersjs/typebox'
import { fieldSchema } from '../schemas/form'
import { AnyData } from './commons'

type FormField = Static<typeof fieldSchema>

export interface TFormFieldCategory {
  icon: string
  names: string[]
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
}
