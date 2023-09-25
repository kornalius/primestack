import { TFrontAction } from '@/features/Actions/interface'
// eslint-disable-next-line import/no-cycle
import { stringToExpr } from '@/features/Expression/composites'
import globalSetvar from '@/shared/actions/setvar'
import { useVariables } from '@/features/Variables/store'
import Setvar from '../components/setvar.vue'

export default {
  ...globalSetvar,
  icon: 'mdi-pencil',
  color: 'blue-6',
  component: Setvar,
  exec: async (args) => {
    const variables = useVariables()
    variables.set(args.name as string, stringToExpr(args.value as string))
  },
} as TFrontAction
