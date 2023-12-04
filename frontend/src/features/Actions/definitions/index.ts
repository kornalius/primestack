// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
// eslint-disable-next-line import/no-cycle
import dialog from './dialog'
import console from './console'
import notify from './notify'
import navigate from './navigate'
import merge from './merge'
import extract from './extract'
import filter from './filter'
import map from './map'
import fetch from './fetch'
import download from './download'
import getvar from './getvar'
import setvar from './setvar'
import unsetvar from './unsetvar'
import insert from './insert'
import patch from './patch'
import remove from './remove'
import ifExpr from './if'
import loop from './loop'
import interval from './interval'
import timeout from './timeout'
import cancel from './cancel'
import getsetting from './getsetting'
import setsetting from './setsetting'
import unsetsetting from './unsetsetting'
import getselected from './getselected'
import select from './select'

const separator = (label: string, icon: string, color?: string): TFrontAction => ({
  type: '$separator',
  label,
  icon,
  color: color || 'white',
  iconColor: color || 'white',
})

export const actions = [
  separator('actions.separators.interactions', 'mdi-message-badge', 'green-2'),
  console,
  dialog,
  notify,
  separator('actions.separators.json', 'mdi-code-json', 'brown-2'),
  merge,
  extract,
  filter,
  map,
  separator('actions.separators.flow', 'mdi-source-branch', 'purple-2'),
  ifExpr,
  loop,
  timeout,
  interval,
  cancel,
  separator('actions.separators.navigation', 'mdi-open-in-app', 'blue-2'),
  navigate,
  separator('actions.separators.variables', 'mdi-variable', 'red-2'),
  getvar,
  setvar,
  unsetvar,
  separator('actions.separators.user', 'mdi-account', 'yellow-2'),
  getsetting,
  setsetting,
  unsetsetting,
  separator('actions.separators.table', 'mdi-database', 'orange-2'),
  insert,
  patch,
  remove,
  getselected,
  select,
  separator('actions.separators.network', 'mdi-wan', 'pink-2'),
  fetch,
  download,
]
