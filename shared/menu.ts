import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { menuSchema } from './schemas/menu'
import { hexObjectId } from './schema'

type Menu = Static<typeof menuSchema>

/**
 * Recreate ids in a form
 *
 * @param menu Menu instance
 *
 * @returns {Menu}
 */
export const recreateMenuIds = (menu: Menu): Menu => {
  // eslint-disable-next-line no-param-reassign
  menu._id = hexObjectId()

  // eslint-disable-next-line no-underscore-dangle
  menu.tabs.forEach((t) => {
    // eslint-disable-next-line no-param-reassign
    t._id = hexObjectId()
  })

  return menu
}
