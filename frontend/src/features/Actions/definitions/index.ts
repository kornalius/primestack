// eslint-disable-next-line import/no-cycle
import dialog from './dialog'
import notify from './notify'
import patch from './patch'
import remove from './remove'
import setvar from './setvar'
import unsetvar from './unsetvar'

export const actions = [
  dialog,
  notify,
  patch,
  remove,
  setvar,
  unsetvar,
]
