import schema from '@/shared/schemas/actions/dialog'
import dialog from './components/dialog.vue'
import { TFrontAction } from '../interface'

export default {
  type: 'dialog',
  label: 'Dialog',
  description: 'Display confirmation dialog',
  icon: 'mdi-dock-window',
  color: 'red-4',
  schema,
  acceptsChildren: true,
  component: dialog,
  exec: ({ value, quasar }) => {
    quasar.dialog({
      title: value.title,
      persistent: true,
      message: value.message,
      ok: value.ok,
      cancel: value.cancel,
    }).onOk(() => {
      console.log('ok')
    }).onCancel(() => {
      console.log('cancel')
    })
  },
} as TFrontAction
