export interface ExpressionMenu {
  name: string
  label: string
  icon?: string
  children?: ExpressionMenu[]
  value?: string
  cursorAdj?: number
  tooltip?: string
}
