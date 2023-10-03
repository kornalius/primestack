import { Static } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalDialog from '@/shared/actions/dialog'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'
import Dialog from '../components/dialog.vue'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalDialog,
  icon: 'mdi-dock-window',
  color: 'blue-4',
  description: 'actions.dialog.description',
  childrenMessage: 'actions.dialog.childrenMessage',
  component: Dialog,
  hideTitle: true,
  exec: async (args) => {
    args.quasar.dialog({
      title: args.title as string,
      persistent: true,
      message: args.message as string,
      ok: args.ok as AnyData,
      cancel: args.cancel as AnyData,
    }).onOk(() => {
      // eslint-disable-next-line no-underscore-dangle
      exec(args._children as ActionElement[], args)
    }).onCancel(() => {
    })
  },
  defaultValues: {
    ok: {
      color: 'green',
      outline: true,
    },
    cancel: {
      color: 'red',
      outline: true,
    },
  },
} as TFrontAction
