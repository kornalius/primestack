import { createLexer } from 'leac'
import { AnyData } from '@/shared/interfaces/commons'

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

export const filterToMongo = (filter: string): AnyData => {
  const negOps = {
    ':': '-',
    '<': '>',
    '<=': '>=',
    '>': '<',
    '>=': '<=',
  }

  const { tokens, complete } = lex(filter)

  if (complete) {
    const criterias = {}
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
            const value = tokens[i].name === 'number'
              ? Number(tokens[i].text)
              : tokens[i].text
            switch (op) {
              case ':':
                criterias[field] = value
                break
              case '-':
                criterias[field] = { $ne: value }
                break
              case '<':
                criterias[field] = { $lt: value }
                break
              case '<=':
                criterias[field] = { $lte: value }
                break
              case '>':
                criterias[field] = { $gt: value }
                break
              case '>=':
                criterias[field] = { $gte: value }
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
