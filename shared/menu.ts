import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { menuSchema, variableSchema } from './schemas/menu'
import { hexObjectId } from './schema'

type Variable = Static<typeof variableSchema>
type Menu = Static<typeof menuSchema>

export const newNameForVariable = (list: Variable[]): string => {
  let index = 1
  let newName = `variable${index}`.toLowerCase()
  let variable = list.find((v: Variable) => (
    v.name.toLowerCase() === newName
  ))
  while (variable) {
    index += 1
    newName = `variable${index}`.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-loop-func,no-loop-func
    variable = list.find((v: Variable) => (
      v.name.toLowerCase() === newName
    ))
  }
  return newName
}

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
