import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalLoop from '@/shared/actions/loop'
// eslint-disable-next-line import/no-cycle
import { runExpr } from '@/features/Expression/composites'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'
import Loop from '../components/loop.vue'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalLoop,
  icon: 'mdi-repeat',
  color: 'purple-2',
  hideTitle: true,
  description: 'actions.loop.description',
  childrenMessage: 'actions.loop.childrenMessage',
  component: Loop,
  exec: async (ctx) => {
    const value = runExpr(ctx.expr as string, ctx.$expr)
    if (value !== undefined && value !== null) {
      switch (typeof value) {
        case 'number':
          await Promise.all(new Array(value).fill(undefined).map((_, index) => (
            // eslint-disable-next-line no-underscore-dangle
            exec(ctx._children as ActionElement[], { ...ctx, index })
          )))
          break

        case 'string':
          await Promise.all(value.split('').map((ch, index) => (
            // eslint-disable-next-line no-underscore-dangle
            exec(ctx._children as ActionElement[], { ...ctx, value: ch, index })
          )))
          break

        case 'boolean':
          while (runExpr(ctx.expr as string, ctx.$expr)) {
            // eslint-disable-next-line no-underscore-dangle,no-await-in-loop
            await exec(ctx._children as ActionElement[], ctx)
          }
          break

        case 'object':
          if (Array.isArray(value)) {
            await Promise.all(value.map((v, index) => (
              // eslint-disable-next-line no-underscore-dangle
              exec(ctx._children as ActionElement[], { ...ctx, value: v, index })
            )))
          } else {
            await Promise.all(Object.keys(value).map((k, index) => (
              // eslint-disable-next-line no-underscore-dangle
              exec(ctx._children as ActionElement[], { ...ctx, value: k, index })
            )))
          }
          break

        default:
          break
      }
    }
  },
  defaultValues: {
  },
} as TFrontAction
