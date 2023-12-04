import { AnyData } from './commons'

enum SnackTypes {
  Success,
  Info,
  Warning,
  Error,
}

export type SnackType = keyof typeof SnackTypes

export interface Snack {
  id?: string
  level?: SnackType
  message: string
  timeout?: number
  error?: AnyData
}
