export interface Menu {
  name: string
  label: string
  icon?: string
  children?: Menu[]
  value?: string
  cursorAdj?: number
  tooltip?: string
}
