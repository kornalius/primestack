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
  // schema for the arguments for the action
  schema: TSchema
  // does this action accepts children element?
  acceptsChildren?: boolean
  // default values for properties
  defaultValues?: AnyData
}
