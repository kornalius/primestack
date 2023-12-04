// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalSelect from '@/shared/actions/select'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Select from '../components/select.vue'

export default {
  ...globalSelect,
  icon: 'mdi-select-drag',
  component: Select,
  hideTitle: true,
  description: 'actions.select.description',
  childrenMessage: 'actions.select.childrenMessage',
  exec: async (ctx) => {
    const rows = getProp(ctx.rows, ctx) as AnyData[]
    ctx.app.setSelection(rows)
  },
} as TFrontAction
