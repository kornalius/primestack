import { Static } from '@feathersjs/typebox'
import { blueprintSchema } from './schemas/blueprints'

type Blueprint = Static<typeof blueprintSchema>

export const newNameForBlueprint = (list: Blueprint[]): string => {
  let index = 1
  let newName = `Blueprint-${index}`.toLowerCase()
  let blueprint = list.find((b: Blueprint) => (
    b.name.toLowerCase() === newName
  ))
  while (blueprint) {
    index += 1
    newName = `Blueprint-${index}`.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-loop-func,no-loop-func
    blueprint = list.find((b: Blueprint) => (
      b.name.toLowerCase() === newName
    ))
  }
  return newName
}
