import { AnyData } from '@/shared/interfaces/commons'

export interface AddOption {
  label: string
  value: string
  icon?: string
  disabled?: boolean
  paid?: boolean
}

export interface Column {
  field: string
  size?: number
  filterable?: boolean
  primary?: boolean
  class?: string | string[] | AnyData
  style?: string | string[] | AnyData
  title?: string
  titleClass?: string | string[] | AnyData
  titleStyle?: string | string[] | AnyData
}
