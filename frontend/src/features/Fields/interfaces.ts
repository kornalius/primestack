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
  class?: string | string[] | AnyData
  style?: string | string[] | AnyData
  title?: string
  titleClass?: string | string[] | AnyData
  titleStyle?: string | string[] | AnyData
}

export interface Pagination {
  /**
   * Column name (from column definition)
   */
  sortBy?: string | null
  /**
   * Is sorting in descending order?
   */
  descending?: boolean
  /**
   * Page number (1-based)
   */
  page?: number
  /**
   * How many rows per page? 0 means Infinite
   */
  rowsPerPage?: number
  /**
   * For server-side fetching only. How many total database rows are there to be added to the table.
   * If set, causes the QTable to emit @request when data is required.
   */
  rowsNumber?: number
}

export interface Unit {
  label: string
  value: string
  min?: number,
  max?: number,
}

export interface ExTableRowAction {
  label: string
  icon: string
  color?: string
  click: string
}
