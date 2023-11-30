import { AnyData } from './interfaces/commons'
import startCase from 'lodash/startCase'

/**
 * Insert unique values into result
 *
 * @param result Array or object
 * @param values Array of values to insert
 */
export const uniquePushInResult = (result: AnyData[] | AnyData, values: AnyData[]) => {
  if (Array.isArray(result)) {
    result.forEach((r) => {
      values.forEach((f) => {
        if (!r.list.find((rf: AnyData) => rf._id.toString() === f._id.toString())) {
          r.list.push(f)
        }
      })
    })
  } else {
    values.forEach((f) => {
      if (!result.list.find((rf: AnyData) => rf._id.toString() === f._id.toString())) {
        result.list.push(f)
      }
    })
  }
}

export const newName = (type: string, fields: AnyData[], prop = 'name'): string => {
  let index = 1
  let newName = `${startCase(type)}${index}`.toLowerCase()
  let field = fields.find((f) => f[prop]?.toLowerCase() === newName)
  while (field) {
    index += 1
    newName = `${startCase(type)}${index}`.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-loop-func,no-loop-func
    field = fields.find((f) => f[prop]?.toLowerCase() === newName)
  }
  return `${startCase(type)}${index}`
}
