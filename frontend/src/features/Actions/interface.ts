import { QVueGlobals } from 'quasar'
import { PiniaService } from 'feathers-pinia'
import { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { Application } from '@feathersjs/client'
import { Static } from '@feathersjs/typebox'
import { FeathersService } from '@feathersjs/feathers'
import { TAction, TActionCategory } from '@/shared/interfaces/actions'
import { actionElementSchema } from '@/shared/schemas/actions'
import { AnyData } from '@/shared/interfaces/commons'
import { useDialog } from '@/features/Dialog/store'
import { useVariables } from '@/features/Variables/store'
import { useApp } from '@/features/App/store'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/Editor/store'
import { useSnacks } from '@/features/Snacks/store'
import { useAuth } from '@/features/Auth/store'

type ActionElement = Static<typeof actionElementSchema>

export interface TFrontActionExecOptions {
  action: ActionElement
  quasar: QVueGlobals
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  api: Application<any, any>
  editor: ReturnType<typeof useAppEditor>
  app: ReturnType<typeof useApp>
  variables: ReturnType<typeof useVariables>
  dialog: ReturnType<typeof useDialog>
  snacks: ReturnType<typeof useSnacks>
  store: ReturnType<typeof useDialog>
  auth: ReturnType<typeof useAuth>
  route: RouteLocationNormalizedLoaded
  router: Router
  $expr: AnyData
  useFeathersService: (servicePath: string) => PiniaService<FeathersService>
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
  exec?: (options: TFrontActionExecOptions) => Promise<AnyData | void>
  // hide the action element title?
  hideTitle?: boolean | ((value: AnyData) => boolean)
  // function called to determine the result keys
  result?: (ctx: TFrontActionExecOptions, prevResult: string[]) => string[]
}
