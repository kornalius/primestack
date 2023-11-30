import { Static } from '@feathersjs/typebox'
import { hexObjectId } from './schema'
import { tableSchema } from './schemas/table'

type Table = Static<typeof tableSchema>

/**
 * Recreate ids in a form
 *
 * @param table Table instance
 *
 * @returns {Table}
 */
export const recreateTableIds = (table: Table): Table => {
  // eslint-disable-next-line no-param-reassign
  table._id = hexObjectId()

  table.fields.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f._id = hexObjectId()
  })

  table.indexes.forEach((i) => {
    // eslint-disable-next-line no-param-reassign
    i._id = hexObjectId()
  })

  return table
}
