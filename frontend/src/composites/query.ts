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

    let prevLogicOp
    criterias.forEach((c, index) => {
      const crit = reduceCriteria(c)
      if (crit) {
        const l = index === criterias.length - 1
          ? (prevLogicOp || c.logicOp)
          : c.logicOp
        expr[`$${l}`].push(crit)
      }
      prevLogicOp = c.logicOp
    })

    return cleanExpr(expr)
  }

  const reduceGroups = (groups: QueryGroup[]): AnyData => {
    const expr = {
      $and: [],
      $or: [],
    }

    let prevLogicOp
    groups.forEach((g, index) => {
      const crits = reduceCriterias(g.criterias)
      if (Object.keys(crits).length) {
        const l = index === groups.length - 1
          ? (prevLogicOp || g.logicOp)
          : g.logicOp
        if (l === 'and') {
          expr.$and = [...expr.$and, crits]
        }
        if (l === 'or' && crits) {
          expr.$or = [...expr.$or, crits]
        }
        prevLogicOp = g.logicOp
      }
    })

    return cleanExpr(expr)
  }

  return reduceGroups(q)
}

export const useQuery = () => ({
  queryToMongo,
})
