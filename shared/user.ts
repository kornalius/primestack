import { AnyData } from './interfaces/commons'

export const newNameForSetting = (settings: AnyData = {}): string => {
  let index = 1
  let newName = `key${index}`.toLowerCase()
  let variable = settings[newName]
  while (variable) {
    index += 1
    newName = `key${index}`.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-loop-func,no-loop-func
    variable = settings[newName]
  }
  return newName
}

export const normalizeName = (name: string): string => (
  name.replace(/[^a-zA-Z0-9]/, '')
)
