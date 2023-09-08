import compact from 'lodash/compact'
import { Static } from '@feathersjs/typebox'
import { Query, QueryCriteria, QueryGroup } from '@/shared/interfaces/query'
import { AnyData } from '@/shared/interfaces/commons'
import { tableSchema } from '@/shared/schemas/table'
// eslint-disable-next-line import/no-cycle
import { exprToString, isExpr, runExpr } from '@/features/Expression/composites'

type TableSchema = Static<typeof tableSchema>

const mongoOperators = {
  '=': '$eq',
  '!=': '$ne',
  '<': '$lt',
  '<=': '$le',
  '>': '$gt',
  '>=': '$ge',
}

const cleanupQuery = (q: AnyData): AnyData => {
  if (!q) {
    return q
  }

  if (q.$and) {
    // eslint-disable-next-line no-param-reassign
    q.$and = compact(q.$and)
  }

  if (q.$and?.length === 0) {
    // eslint-disable-next-line no-param-reassign
    delete q.$and
  }

  while (q.$and?.length === 1 && q.$and[0].$and) {
    // eslint-disable-next-line no-param-reassign
    q.$and = q.$and[0].$and
  }

  if (q.$and?.length === 1) {
    // eslint-disable-next-line no-param-reassign
    q = {
      ...q.$and[0],
    }
  }

  return q
}

export const queryToMongo = (q: Query, schema: TableSchema, ctx: AnyData): AnyData => {
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
    if (c.fieldId && c.op && c.value !== null && c.value !== undefined) {
      const v = isExpr(c.value)
        ? runExpr(exprToString(c.value), ctx)
        : c.value

      const n = schema?.fields
        .find((f) => f._id === c.fieldId)?.name

      if (c.op === 'like' && typeof v === 'string') {
        return { [n]: new RegExp(v, 'i') }
      }

      if (c.op !== '=') {
        return { [n]: { [mongoOperators[c.op]]: v } }
      }

      return { [n]: v }
    }

    return undefined
  }

  const reduceCriterias = (criterias: QueryCriteria[]): AnyData => {
    const expr = {
      $and: [],
      $or: [],
    }

    let prevLogicOp: string
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

    let prevLogicOp: string
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

  return {
    $limit: Number(q.limit) || 10,
    $skip: Number(q.skip) || 0,
    ...cleanupQuery(reduceGroups(q.groups)),
  }
}

export const queryToString = (query: Query, schema: TableSchema): string => {
  let r = []

  const convertCriterias = (criterias: QueryCriteria[]): string[] => {
    const cr = []
    criterias.forEach((c, index) => {
      const n = schema?.fields
        .find((f) => f._id === c.fieldId)?.name

      if (!n || !c.op || c.value === undefined || c.value === null) {
        return
      }

      cr.push(n)
      cr.push(` ${c.op} `)
      if (isExpr(c.value)) {
        cr.push(exprToString(c.value))
      } else {
        cr.push(JSON.stringify(c.value))
      }
      if (c.logicOp === 'and' && index < criterias.length - 1) {
        cr.push(' AND ')
      } else if (c.logicOp === 'or' && index < criterias.length - 1) {
        cr.push(' OR ')
      }
    })
    return cr
  }

  const convertGroup = (g: QueryGroup): string[] => (
    ['(', ...convertCriterias(g.criterias), ')']
  )

  query.groups?.forEach((g, index) => {
    r = r.concat(convertGroup(g))
    if (g.logicOp === 'and' && index < query.groups.length - 1) {
      r.push(' AND ')
    } else if (g.logicOp === 'or' && index < query.groups.length - 1) {
      r.push(' OR ')
    }
  })

  return r.length ? r.join('') : undefined
}

export const useQuery = () => ({
  cleanupQuery,
  queryToMongo,
  queryToString,
})
