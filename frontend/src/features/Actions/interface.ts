import { QVueGlobals } from 'quasar'
import { Static } from '@feathersjs/typebox'
import { TAction } from '@/shared/interfaces/actions'
import { actionElementSchema } from '@/shared/schemas/actions'
import { Application } from '@feathersjs/client'

type ActionElement = Static<typeof actionElementSchema>

export interface TFrontActionExecOptions {
  action: ActionElement
  quasar: QVueGlobals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: Application<any, any>
  snacks: unknown
  [key: string]: unknown
}

export interface TFrontAction extends TAction {
  exec?: (options: TFrontActionExecOptions) => void
}
