import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from './schemas/actions'

type ActionElement = Static<typeof actionElementSchema>

export const flattenActions = (actions: ActionElement[]): ActionElement[] => {
  const flattended: ActionElement[] = []

  const flatten = (list: ActionElement[]): void => {
    list.forEach((a) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flattended.push(a as any)

      // eslint-disable-next-line no-underscore-dangle
      const children = a._children
      if (children) {
        flatten(children)
      }
    })
  }

  flatten(actions)

  return flattended
}

export const keyboardEvent = (e: KeyboardEvent) => ({
  key: e.key,
  code: e.code,
  shift: e.shiftKey,
  ctrl: e.ctrlKey,
  alt: e.altKey,
  meta: e.metaKey,
})
