import { TSchema } from '@feathersjs/typebox'
import { AnyData } from './commons'

export interface TFormFieldCategory {
  icon: string
  names: string[]
}

export interface TFormComponent {
  // unique type for the component
  type: string
  // use the component as a row or card
  row?: boolean
  // use the component as a col or card-section
  col?: boolean
  // label for the component
  label: string
  // component to use
  component?: unknown
  // icon for the component
  icon: string
  // don't create a key for preview data
  nokey?: boolean
  // don't generate a new name for newly placed component on the form
  noName?: boolean
  // should we hide the component from the palette?
  hidden?: boolean
  // component properties schema
  schema: TSchema
  // default values for properties
  defaultValues?: AnyData
  // edit mode styles to add to component
  editStyles?: AnyData
  // split schema keys into different categories and order items in the properties list
  categories?: Record<string, TFormFieldCategory>
  // use an horizontal layout for properties
  horizontal?: boolean
  // use an horizontal layout for properties in a popup editing
  horizontalPopup?: boolean
  // can you desactivate the drag & drop to play with the component?
  interactable?: boolean
}

export interface TFormColumn {
  _id: string
  _type: string
  size: number
  _fields: TFormField[]
  [k: string]: unknown
}

export interface TFormField {
  _id: string
  _type: string
  name: string
  _columns?: TFormColumn[]
  [k: string]: unknown
}
