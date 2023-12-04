import { Static } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalDialog from '@/shared/actions/dialog'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { TFrontAction, TFrontActionExecOptions } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'
import Dialog from '../components/dialog.vue'

type ActionElement = Static<typeof actionElementSchema>

const convertButton = (button: AnyData, ctx: TFrontActionExecOptions): AnyData => ({
  hidden: getProp(button.hidden, ctx),
  label: anyToString(getProp(button.label, ctx)),
  noCaps: getProp(button.noCaps, ctx),
  color: anyToString(getProp(button.color, ctx)),
  textColor: anyToString(getProp(button.textColor, ctx)),
  icon: anyToString(getProp(button.icon, ctx)),
  iconRight: anyToString(getProp(button.iconRight, ctx)),
  size: anyToString(getProp(button.size, ctx)),
  outline: getProp(button.outline, ctx),
  unelevated: getProp(button.unelevated, ctx),
  rounded: getProp(button.rounded, ctx),
  round: getProp(button.round, ctx),
  square: getProp(button.square, ctx),
  flat: getProp(button.flat, ctx),
})

const compactKeys = (value: AnyData): AnyData => (
  Object.keys(value)
    .filter((k) => value[k] !== undefined)
    .reduce((acc, k) => ({
      ...acc,
      [k]: value[k],
    }), {})
)

export default {
  ...globalDialog,
  icon: 'mdi-dock-window',
  color: 'blue-4',
  description: 'actions.dialog.description',
  childrenMessage: 'actions.dialog.childrenMessage',
  component: Dialog,
  hideTitle: true,
  exec: async (ctx) => {
    const title = anyToString(getProp(ctx.title, ctx))
    const message = anyToString(getProp(ctx.message, ctx))
    const formId = anyToString(getProp(ctx.formId, ctx))
    const formData = getProp(ctx.formData, ctx)
    const width = anyToString(getProp(ctx.width, ctx))
    const persistent = getProp(ctx.persistent, ctx) as boolean
    ctx.dialog.open({
      title,
      message,
      formId,
      formData,
      persistent,
      width,
      ok: compactKeys(convertButton(ctx.ok, ctx)),
      cancel: compactKeys(convertButton(ctx.cancel, ctx)),
      onOk: () => {
        // eslint-disable-next-line no-underscore-dangle
        exec(ctx._children as ActionElement[], ctx)
      },
    })
  },
  result: (ctx): string[] => (
    Object.keys(ctx.dialog.formData)
  ),
  defaultValues: {
    persistent: true,
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
