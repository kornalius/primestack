import { QueryCriteria, QueryGroup } from '@/shared/interfaces/query'
import { AnyData } from '@/shared/interfaces/commons'

const mongoOperators = {
  '=': '$eq',
  '!=': '$ne',
  '<': '$lt',
  '<=': '$le',
  '>': '$gt',
  '>=': '$ge',
}

const queryToMongo = (q: QueryGroup[]): AnyData => {
  const cleanExpr = (expr: AnyData): AnyData => {
    if (expr.$and.length === 0) {
      // eslint-disable-next-line no-param-reassign
      delete expr.$and
    }
    if (expr.$or.length === 0) {
      // eslint-disable-next-line no-param-reassign
      delete expr.$or
    }
    return expr
  }

  const reduceCriteria = (c: QueryCriteria): AnyData | undefined => {
    if (c.fieldId && c.value !== null && c.value !== undefined) {
      if (c.op === 'like') {
        return { [c.fieldId]: new RegExp(c.value, 'i') }
      }
      if (c.op !== '=') {
        return { [c.fieldId]: { [mongoOperators[c.op]]: c.value } }
      }
      return { [c.fieldId]: c.value }
    }

    return undefined
  }

  const reduceCriterias = (criterias: QueryCriteria[]): AnyData => {
    const expr = {
      $and: [],
      $or: [],
    }

    criterias.forEach((c) => {
      const crit = reduceCriteria(c)
      if (crit) {
        expr[`$${c.logicOp}`].push(crit)
      }
    })

    return cleanExpr(expr)
  }

  const reduceGroups = (groups: QueryGroup[]): AnyData => {
    const expr = {
      $and: [],
      $or: [],
    }

    groups.forEach((g) => {
      const crits = reduceCriterias(g.criterias)
      if (Object.keys(crits).length) {
        if (g.logicOp === 'and') {
          expr.$and = [...expr.$and, crits]
        }
        if (g.logicOp === 'or' && crits) {
          expr.$or = [...expr.$or, crits]
        }
      }
    })

    return cleanExpr(expr)
  }

  return reduceGroups(q)
}

export const useQuery = () => ({
  queryToMongo,
})
