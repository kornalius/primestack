export interface Query {
  schemaId: string
  groups: QueryGroup[]
}

export type QueryLogicalOp = 'and' | 'or'

export const queryOperators = ['=', '!=', '<=', '>=', '<', '>', 'like']

export type QueryOperator = '=' | '!=' | '<=' | '>=' | '<' | '>' | 'like'

export interface QueryGroup {
  criterias: QueryCriteria[]
  logicOp: QueryLogicalOp
}

export interface QueryCriteria {
  fieldId: string
  op: QueryOperator
  value: string
  logicOp: QueryLogicalOp
}
