import { AnyData } from '@/shared/interfaces/commons'
import { IdColumn } from '@/shared/extypes'

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

export interface ExTableColumn {
  /**
   * Unique id for the column
   */
  _id?: string
  /**
   * Unique id, identifies column, (used by pagination.sortBy, 'body-cell-[name]' slot, ...)
   */
  name: string
  /**
   * Label for header
   */
  label: string
  /**
   * Row Object property to determine value for this column or function which maps to the
   * required property
   *
   * @param row The current row being processed
   *
   * @returns Value for this column
   */
  field: string | ((row: AnyData) => unknown)
  /**
   * If we use visible-columns, this col will always be visible
   */
  required?: boolean
  /**
   * Horizontal alignment of cells in this column
   * Default value: right
   */
  align?: 'left' | 'right' | 'center'
  /**
   * Tell QTable you want this column sortable
   */
  sortable?: boolean
  /**
   * Compare function if you have some custom data or want a specific way to compare two rows
   *
   * @param a Value of the first comparison term
   * @param b Value of the second comparison term
   * @param rowA Full Row object in which is contained the first term
   * @param rowB Full Row object in which is contained the second term
   *
   * @returns Comparison result of term 'a' with term 'b'. Less than 0 when 'a' should come first;
   * greater than 0 if 'b' should come first; equal to 0 if their position must not be changed
   * with respect to each other
   */
  sort?: (a: AnyData, b: AnyData, rowA: AnyData, rowB: AnyData) => number
  /**
   * Set column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending);
   * Overrides the 'column-sort-order' prop
   * Default value: ad
   */
  sortOrder?: 'ad' | 'da'
  /**
   * Function you can apply to format your data
   * @param val Value of the cell
   * @param row Full Row object in which the cell is contained
   * @returns The resulting formatted value
   */
  format?: (val: unknown, row: AnyData) => unknown
  /**
   * Style to apply on normal cells of the column
   *
   * @param row The current row being processed
   */
  style?: string | ((row: AnyData) => string)
  /**
   * Classes to add on normal cells of the column
   *
   * @param row The current row being processed
   */
  classes?: string | ((row: AnyData) => string)
  /**
   * Style to apply on header cells of the column
   */
  headerStyle?: string
  /**
   * Classes to add on header cells of the column
   */
  headerClasses?: string
  /**
   * Text color while in display mode (not editing)
   */
  textColor?: string | ((row: AnyData) => string)
  /**
   * Editing type to use
   */
  type?: string
  /**
   * Editing format for strings
   */
  editFormat?: string
  /**
   * Should we display the text as a chip?
   */
  chip?: boolean
  /**
   * Editing pattern for strings
   */
  pattern?: string
  /**
   * Minimum value for numeric or slider input
   */
  min?: number
  /**
   * Exclusive minimum value for numeric or slider input
   */
  exclusiveMin?: number
  /**
   * Maximum value for numeric or slider input
   */
  max?: number
  /**
   * Exclusive maximum value for numeric or slider input
   */
  exclusiveMax?: number
  /**
   * Use a slider for numeric input
   */
  slider?: boolean
  /**
   * Minimum date value
   */
  dateMin?: string
  /**
   * Minimum exclusive date value
   */
  dateExclusiveMin?: string
  /**
   * Maximum date value
   */
  dateMax?: string
  /**
   * Maximum exclusive date value
   */
  dateExclusiveMax?: string
  /**
   * Use a select dropdown with options
   */
  options?: { label: string, value: string, icon?: string }[]
  /**
   * Multiple options?
   */
  multiple?: boolean
  /**
   * Use toggles instead of regular dropdown selector for options?
   */
  toggles?: boolean
  /**
   * Should we use rating icons for numeric input?
   */
  rating?: boolean
  /**
   * Icon to use for rating input
   */
  ratingIcon?: string
  /**
   * Filled icon to use for rating input
   */
  ratingIconFilled?: string
  /**
   * Half filled rating icon
   */
  ratingIconHalf?: string
  /**
   * Color for chips, slider or rating icons
   */
  color?: string | ((row: AnyData) => string)
  /**
   * Lookup service
   */
  service?: string
  /**
   * Lookup query
   */
  query?: AnyData
  /**
   * Lookup columns
   */
  columns?: IdColumn[]
  /**
   * Lookup value field
   */
  valueField?: string
  /**
   * Lookup display field
   */
  labelField?: string
}
