import { TSchema } from '@feathersjs/typebox'
import { AnyData } from './commons'

export interface TFormComponent {
  element: string
  label: string
  icon: string
  schema: TSchema
  component: unknown
}

export interface TFormField {
  id: string
  type: string
  label: string
  options: AnyData
}
