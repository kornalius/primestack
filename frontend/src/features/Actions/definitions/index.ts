import { TFrontAction } from '@/features/Actions/interface'
// eslint-disable-next-line import/no-cycle
import dialog from './dialog'
import console from './console'
import notify from './notify'
import navigate from './navigate'
import setvar from './setvar'
import unsetvar from './unsetvar'
import insert from './insert'
import patch from './patch'
import remove from './remove'
import ifExpr from './if'

const separator = (label: string, icon: string, color?: string): TFrontAction => ({
  type: '$separator',
  label,
  icon,
  color: color || 'white',
  iconColor: color || 'white',
})

export const actions = [
  separator('Interactions', 'mdi-message-badge', 'green-2'),
  console,
  dialog,
  notify,
  separator('Flow', 'mdi-source-branch', 'purple-2'),
  ifExpr,
  separator('Interactions', 'mdi-open-in-app', 'blue-2'),
  navigate,
  separator('Variables', 'mdi-variable', 'red-2'),
  setvar,
  unsetvar,
  separator('Table', 'mdi-database', 'orange-2'),
  insert,
  patch,
  remove,
]
