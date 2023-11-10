import { Static } from '@feathersjs/typebox'
import { hexObjectId } from './schema'
import { tableSchema } from './schemas/table'

type Table = Static<typeof tableSchema>

export const newNameForTable = (list: Table[]): string => {
  let index = 1
  let newName = `table${index}`.toLowerCase()
  let variable = list.find((t: Table) => (
    t.name.toLowerCase() === newName
  ))
  while (variable) {
    index += 1
    newName = `table${index}`.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-loop-func,no-loop-func
    variable = list.find((t: Table) => (
      t.name.toLowerCase() === newName
    ))
  }
  return newName
}

/**
 * Recreate ids in a form
 *
 * @param table Table instance
 *
 * @returns {Table}
 */
export const recreateTableIds = (table: Table): Table => {
  const oid = table._id
  // eslint-disable-next-line no-param-reassign
  table._id = hexObjectId()

  table.fields.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f._id = hexObjectId()
    if (f.refTableId === oid) {
      // eslint-disable-next-line no-param-reassign
      f.refTableId = table._id
    }
  })

  table.indexes.forEach((i) => {
    // eslint-disable-next-line no-param-reassign
    i._id = hexObjectId()
  })

  return table
}
