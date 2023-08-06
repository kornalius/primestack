import { TSchema } from '@feathersjs/typebox'
import { AnyData } from './commons'

export interface TActionCategory {
  icon: string
  names: string[]
}

export interface TAction {
  // type of the action (unique identifier)
  type: string
  // label for the action
  label: string | ((value?: AnyData) => string)
  // description for the action
  description: string | ((value?: AnyData) => string)
  // icon for the action
  icon: string | ((value?: AnyData) => string)
  // color of the icon for the action
  iconColor: string | ((value?: AnyData) => string)
  // color for the action banner on the left
  color: string | ((value?: AnyData) => string)
  // should we hide the action from the list of selectable actions
  hidden?: boolean
  // schema for the arguments for the action
  schema: TSchema
  // does this action accepts children element?
  acceptsChildren?: boolean
  // message to display when there are no children
  childrenMessage?: string
  // component to use
  component?: unknown
  // split schema keys into different categories and order items in the properties list
  categories?: Record<string, TActionCategory>
  // default values for properties
  defaultValues?: AnyData
}
