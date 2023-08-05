import { TSchema } from '@feathersjs/typebox'

export interface TActionCategory {
  icon: string
  names: string[]
}

export interface TAction {
  // type of the action (unique identifier)
  type: string
  // label for the action
  label: string
  // description for the action
  description: string
  // icon for the action
  icon: string
  // color for the action banner on the left
  color: string
  // should we hide the action from the list of selectable actions
  hidden?: boolean
  // schema for the arguments for the action
  schema: TSchema
  // does this action accepts children element?
  acceptsChildren?: boolean
  // component to use
  component?: unknown
  // split schema keys into different categories and order items in the properties list
  categories?: Record<string, TActionCategory>
}
