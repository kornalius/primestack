import { createLexer } from 'leac'
import { AnyData } from '@/shared/interfaces/commons'
import { Static } from '@feathersjs/typebox'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { componentsByType } from '@/features/Components'
import { columnSchema, fieldSchema, formSchema } from '@/shared/schemas/form'
import { useFeathersService } from '@/composites/feathers'
import { flattenFields } from '@/shared/form'
import { generateFormField } from '@/features/Tables/composites'
import { newForm, newFormField } from '@/features/Forms/composites'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>
type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const isExpr = /[:<=>]/g

const lex = createLexer([
  { name: ':' },
  { name: '-' },
  { name: '<=' },
  { name: '>=' },
  { name: '<' },
  { name: '>' },
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

export const useFilter = () => ({
  /**
   * Converts a string into a mongo query
   *
   * @param filter Filter string
   * @param fields
   *
   * @returns {AnyData}
   *
   * format:
   *   <fieldname> :|:-|<|<=|>|>= <value>
   */
  filterToMongo: (filter: string, fields: TableField[]): AnyData => {
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
  },

  /**
   * Generate a form from queryable table fields
   *
   * @param tableId Table id
   * @param fields Array of table fields
   *
   * @returns {Form}
   */
  generateFiltersForm: (tableId?: string, fields?: TableField[]): Form => {
    const userForm = useFeathersService('forms')
      .findOneInStore({ query: {} })

    const form = newForm(userForm.value.list)

    const addFieldToForm = (
      type: string,
      f: TableField,
      options?: AnyData,
    ): FormField | FormColumn | undefined => {
      const component = componentsByType[type]
      if (component) {
        // eslint-disable-next-line no-underscore-dangle
        const field = newFormField(type, flattenFields(form._fields), {
          field: f.name,
          label: f.name,
          dense: true,
          outline: true,
          clearable: true,
          ...(options || {}),
          toggleIndeterminate: true,
        })
        if (field) {
          // eslint-disable-next-line no-underscore-dangle
          form._fields.push(field)
        }
      }
      return undefined
    }

    let table: Table
    let useFields = fields

    if (tableId) {
      const userTable = useFeathersService('tables')
        .findOneInStore({ query: {} })
      table = userTable.value?.list.find((t: Table) => t._id === tableId) as Table
      if (table) {
        useFields = table.fields
          .filter((f) => f.hidden !== true && f.queryable)
      }
    }

    useFields.forEach((f) => {
      generateFormField(f, addFieldToForm, table)
    })

    return form
  },
})
