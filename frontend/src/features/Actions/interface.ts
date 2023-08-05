import { QVueGlobals } from 'quasar'
import { Static } from '@feathersjs/typebox'
import { TAction } from '@/shared/interfaces/actions'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'

type ActionElement = Static<typeof actionElementSchema>

export interface TFrontActionExecOptions {
  value: AnyData
  action: ActionElement
  quasar: QVueGlobals
}

export interface TFrontAction extends TAction {
  exec?: (options: TFrontActionExecOptions) => void
}
