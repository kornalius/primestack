// eslint-disable-next-line import/no-cycle
import dialog from './dialog'
import notify from './notify'
import patch from './patch'
import remove from './remove'

export const actions = [
  dialog,
  notify,
  patch,
  remove,
]
