import { AnyData } from './interfaces/commons'

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
