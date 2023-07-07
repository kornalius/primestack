import { AnyData } from './commons'

enum SnackTypes {
  Success,
  Info,
  Warning,
  Error,
}

type SnackType = keyof typeof SnackTypes

export interface Snack {
  id?: string
  message: string
  level: SnackType
  timeout?: number
  error?: AnyData
}
