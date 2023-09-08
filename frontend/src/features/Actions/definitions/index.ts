import { TFrontAction } from '@/features/Actions/interface'
// eslint-disable-next-line import/no-cycle
import dialog from './dialog'
import notify from './notify'
import navigate from './navigate'
import setvar from './setvar'
import unsetvar from './unsetvar'
import insert from './insert'
import patch from './patch'
import remove from './remove'

const separator = (label: string, icon: string, color?: string): TFrontAction => ({
  type: '$separator',
  label,
  icon,
  color: color || 'white',
  iconColor: color || 'white',
})

export const actions = [
  separator('Interactions', 'mdi-message-badge', 'green-2'),
  dialog,
  notify,
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
