import { Static } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalDialog from '@/shared/actions/dialog'
import Dialog from '../components/dialog.vue'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import useActions from '../composites'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalDialog,
  icon: 'mdi-dock-window',
  color: 'blue-4',
  childrenMessage: 'When user press the OK button...',
  component: Dialog,
  exec: async (args) => {
    args.quasar.dialog({
      title: args.title as string,
      persistent: true,
      message: args.message as string,
      ok: args.ok as AnyData,
      cancel: args.cancel as AnyData,
    }).onOk(() => {
      const { exec } = useActions()
      // eslint-disable-next-line no-underscore-dangle
      exec(args._children as ActionElement[], args)
    }).onCancel(() => {
    })
  },
} as TFrontAction