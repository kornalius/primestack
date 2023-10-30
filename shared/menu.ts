import { Static } from '@feathersjs/typebox'
import { variableSchema } from './schemas/menu'

type Variable = Static<typeof variableSchema>

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
