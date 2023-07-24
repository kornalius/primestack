export interface Query {
  tableId: string
  // eslint-disable-next-line no-use-before-define
  groups: QueryGroup[]
}

export type QueryLogicalOp = 'and' | 'or'

export const queryOperators = ['=', '!=', '<=', '>=', '<', '>', 'like']

export type QueryOperator = '=' | '!=' | '<=' | '>=' | '<' | '>' | 'like'

export interface QueryGroup {
  // eslint-disable-next-line no-use-before-define
  criterias: QueryCriteria[]
  logicOp: QueryLogicalOp
}

export interface QueryCriteria {
  fieldId: string
  op: QueryOperator
  value: string
  logicOp: QueryLogicalOp
}
