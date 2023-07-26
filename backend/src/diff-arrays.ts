import deepDiff from 'deep-diff'
import difference from 'lodash/fp/difference'
import groupBy from 'lodash/fp/groupBy'
import isArray from 'lodash/fp/isArray'
import isEqual from 'lodash/fp/isEqual'
import isFunction from 'lodash/fp/isFunction'
import isObject from 'lodash/fp/isObject'
import isString from 'lodash/fp/isString'
import keyBy from 'lodash/fp/keyBy'
import map from 'lodash/fp/map'
import values from 'lodash/fp/values'
import { AnyData } from '@/shared/interfaces/commons'

const updatedValues = {
  first: 1,
  second: 2,
  both: 3,
  bothWithDeepDiff: 4,
}

const diff = (
  first: AnyData[],
  second: AnyData[],
  idField: string | ((value: AnyData) => string),
  options: AnyData = {}
) => {
  // set defaults for "options"
  const opts = {
    compareFunction: isEqual, // set default compareFunction to lodash isEqual
    updatedValues: updatedValues.second, // set default to updatedValues.second
    ...options, // override defaults with user-specified values (if specified)
  }

  // parameter validation
  if (!isArray(first)) {
    throw new Error('error: "first" parameter must be an array')
  }
  if (!isArray(second)) {
    throw new Error('error: "second" parameter must be an array')
  }
  if (!isString(idField) && !isFunction(idField)) {
    throw new Error('error: "idField" parameter must be a string or function')
  }
  if (!isObject(options)) {
    throw new Error('error: "options" parameter must be an object')
  }
  if (values(updatedValues).indexOf(opts.updatedValues) === -1) {
    throw new Error('error: "options.updatedValues" must be a one of the ".updatedValues"')
  }
  if (!isFunction(opts.compareFunction)) {
    throw new Error('error: "options.compareFunction" must be a function')
  }

  // arrays to hold the id values in the two arrays
  const firstIds: string[] = []
  const secondIds: string[] = []

  const getId = (o: AnyData) => {
    let k = idField as string
    if (typeof idField === 'function') {
      k = idField(o)
    }
    return o[k]
  }

  // index the first array by its id values.
  // if first is [{ id: 1, a: 1 }, { id: 2, a: 3 }] then
  // firstIndex will be { 1: { id: 1, a: 1 }, 2: { id: 2, a: 3 } }
  // "getKey" has a side-effect of pushing the id value into firstIds; this saves on another iteration through "first"
  const getKey = (o: AnyData) => {
    const id = getId(o)
    firstIds.push(id) // ! side-effect
    return id
  }

  const firstIndex = keyBy(getKey)(first)

  // "groupingFunction" is the function used in the groupBy in the next step.
  // It has a side-effect of pushing the idField value of second object (o2)
  // into the secondIds array. The side-effect can easily be avoided but it saves another iteration "second"
  const groupingFunction = (o2: AnyData) => {
    const k = getId(o2)
    secondIds.push(getId(o2)) // ! side-effect
    const o1 = firstIndex[k] // take advantage of the closure
    if (!o1) {
      return 'added'
    }
    if (opts.compareFunction(o1, o2)) {
      return 'same'
    }
    return 'updated'
  }

  // this creates the "added", "same" and "updated" results
  const result = groupBy(groupingFunction)(second)

  // check what value should be returned for "updated" results
  // updatedValues.second is the default so doesn't have an "if" here
  if (opts.updatedValues === updatedValues.first) {
    result.updated = map((u: AnyData) => firstIndex[getId(u)])(result.updated)
  } else if (opts.updatedValues === updatedValues.both) {
    result.updated = map((u: AnyData) => [firstIndex[getId(u)], u])(result.updated)
  } else if (opts.updatedValues === updatedValues.bothWithDeepDiff) {
    result.updated = map((u: AnyData) => {
      const f = firstIndex[getId(u)]
      const s = u
      const dd = deepDiff(f, s)
      return [f, s, dd]
    })(result.updated)
  }

  // now add "removed" and return
  const removedIds = difference(firstIds)(secondIds)
  const removed = map((id: string) => firstIndex[id])(removedIds)
  return {
    same: [],
    added: [],
    updated: [],
    ...result,
    removed,
  }
}

diff.updatedValues = updatedValues

export default diff
