import { TSchema } from '@feathersjs/typebox'
import { AnyData } from './interfaces/commons'

/**
 * Get a property from the parent element instances
 *
 * @param parents Parent element instances
 * @param name Path name (like filesystem) ex: '../tableId' or '?/tableId' for anywhere
 *
 * @returns {string|undefined}
 */
export const getParentProp = (parents: AnyData[], name: string): string | undefined => {
  const parts = name.split('/')

  let lvl = parents.length - 1
  let i = 0
  while (i < parts.length - 1) {
    if (parts[i] === '..') {
      if (lvl !== -1) {
        lvl -= 1
      }
    } else if (parts[i] === '?') {
      lvl = -1
    } else {
      break
    }
    i += 1
  }

  parts.splice(0, i)
  const n = parts.join('.')

  if (lvl !== -1) {
    return parents[lvl]?.[n]
  }

  i = parents.length - 1
  while (i >= 0) {
    if (parents[i][n]) {
      return parents[i]?.[n]
    }
    i -= 1
  }

  return undefined
}

/**
 * Returns the types allowed for a property in the schema
 */
export const types = (schema: TSchema): string[] | undefined => {
  const p = schema
  if (p?.anyOf) {
    return p.anyOf.map((ty: TSchema) => ty.type)
  }
  return undefined
}
