import { QVueGlobals } from 'quasar'
import { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { Application } from '@feathersjs/client'
import { Static } from '@feathersjs/typebox'
import { TAction, TActionCategory } from '@/shared/interfaces/actions'
import { actionElementSchema } from '@/shared/schemas/actions'
import { AnyData } from '@/shared/interfaces/commons'

type ActionElement = Static<typeof actionElementSchema>

export interface TFrontActionExecOptions {
  action: ActionElement
  quasar: QVueGlobals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: Application<any, any>
  snacks: AnyData
  store: AnyData
  route: RouteLocationNormalizedLoaded,
  router: Router,
  [key: string]: unknown
}

export interface TFrontAction extends TAction {
  // icon for the action
  icon: string | ((value?: AnyData) => string)
  // color of the icon for the action
  iconColor?: string | ((value?: AnyData) => string)
  // color for the action banner on the left
  color?: string | ((value?: AnyData) => string)
  // should we hide the action from the list of selectable actions
  hidden?: boolean
  // message to display when there are no children
  childrenMessage?: string
  // component to use
  component?: unknown
  // split schema keys into different categories and order items in the properties list
  categories?: Record<string, TActionCategory>
  // execute action command
  exec?: (options: TFrontActionExecOptions) => Promise<void>
}
