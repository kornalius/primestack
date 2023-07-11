import { TSchema } from '@feathersjs/typebox'
import { AnyData } from './commons'

export interface TFormComponent {
  // unique type for the component
  type: string
  // label for the component
  label: string
  // icon for the component
  icon: string
  // don't create a key for preview data
  nokey?: boolean
  // should we hide the component from the palette?
  hidden?: boolean
  // component properties schema
  schema: TSchema
  // default values for properties
  defaultValues: AnyData
}

export interface TFormColumn {
  _id: string
  _type: string
  size: number
  fields: TFormField[]
  [k: string]: unknown
}

export interface TFormField {
  _id: string
  _type: string
  name: string
  columns?: TFormColumn[]
  [k: string]: unknown
}
