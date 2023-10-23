import { createLexer } from 'leac'
import { AnyData } from '@/shared/interfaces/commons'
import { Static } from '@feathersjs/typebox'
import { tableFieldSchema } from '@/shared/schemas/table'

type TableField = Static<typeof tableFieldSchema>

const isExpr = /[:<=>]/g

const lex = createLexer([
  { name: ':' },
  { name: '<=' },
  { name: '>=' },
  { name: '<' },
  { name: '>' },
  { name: '-' },
  { name: 'ws', regex: /\s+/, discard: true },
  { name: ',', regex: /,+/, discard: true },
  { name: 'number', regex: /\d+/ },
  { name: 'id', regex: /\w+/ },
  {
    name: 'openQuote',
    discard: true,
    str: '\'',
    push: createLexer([
      { name: 'string', regex: /([^'\\])*/ },
      {
        name: 'closeQuote',
        str: '\'',
        pop: true,
        discard: true,
      },
    ], 'string'),
  },
])

export const filterToMongo = (filter: string, fields: TableField[]): AnyData => {
  const criterias: AnyData = {}

  const valueOf = (value: string, fieldname: string, negative = false): unknown => {
    const v = value.trim()
    const field = fields.find((ff) => ff.name === fieldname)
    switch (field.type) {
      case 'number':
        return Number(v)
      case 'boolean':
        return ['true', 't', 'yes', 'y'].includes(v)
      default:
        return { $regex: negative ? `^((?!${v}).)*$` : v, $options: 'i' }
    }
  }

  // simili-fulltext search on all queryable fields
  if (!filter.match(isExpr) && filter.trim().length > 0) {
    let ff = filter.trim()
    let negField = false
    if (ff.startsWith('-')) {
      negField = true
      ff = ff.substring(1)
    }
    if (ff.length) {
      if (!negField) {
        criterias.$or = []
      }

      fields
        .filter((f) => f.queryable && f.type !== 'boolean')
        .forEach((f) => {
          const v = valueOf(ff, f.name, true)
          if (negField) {
            if (typeof v === 'object') {
              // regex
              criterias[f.name] = v
            } else {
              criterias[f.name] = { $ne: v }
            }
          } else {
            criterias.$or.push({ [f.name]: valueOf(ff, f.name) })
          }
        })
    }
    return criterias
  }

  const negOps = {
    ':': '-',
    '<': '>',
    '<=': '>=',
    '>': '<',
    '>=': '<=',
  }

  const { tokens, complete } = lex(filter)

  if (complete) {
    let i = 0
    let negField = false
    while (i < tokens.length) {
      if (tokens[i].name === '-') {
        negField = true
      } else if (tokens[i].name === 'id') {
        const field = tokens[i].text
        i += 1
        if (i < tokens.length && [':', '<', '>', '<=', '>='].includes(tokens[i].name)) {
          const op = negField ? negOps[tokens[i].text] : tokens[i].text
          i += 1
          if (i < tokens.length && ['id', 'string', 'number'].includes(tokens[i].name)) {
            const value = tokens[i].text
            switch (op) {
              case ':':
                criterias[field] = valueOf(value, field)
                break
              case '-':
                criterias[field] = { $ne: valueOf(value, field) }
                break
              case '<':
                criterias[field] = { $lt: valueOf(value, field) }
                break
              case '<=':
                criterias[field] = { $lte: valueOf(value, field) }
                break
              case '>':
                criterias[field] = { $gt: valueOf(value, field) }
                break
              case '>=':
                criterias[field] = { $gte: valueOf(value, field) }
                break
              default:
                break
            }
          }
          negField = false
        }
      }

      i += 1
    }
    return criterias
  }

  return {}
}
