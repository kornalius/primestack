import { StringEnum, Type } from '@feathersjs/typebox'

export default Type.Object({
  type: StringEnum(['Success', 'Error', 'Info', 'Warn']),
  message: Type.String(),
})
