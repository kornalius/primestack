import { computed, ComputedRef } from 'vue'
import { Snack } from '@/shared/interfaces/snacks'
import useSnackStore from './store'

export default (): {
  count: ComputedRef<number>,
  snacks: ComputedRef<Array<Snack>>,
  push: (snack: Snack) => void,
  pushWarn: (message: string) => void,
  pushError: (message: string) => void,
  pushInfo: (message: string) => void,
  pushSuccess: (message: string) => void,
  pop: () => void,
  remove: (id: string) => void,
  snackClass: (snack: Snack) => string,
} => {
  const store = useSnackStore()

  return {
    count: computed(() => store.count),

    snacks: computed(() => store.snacks),

    push: (snack) => store.pushSnack(snack),

    pushWarn: (message) => store.pushWarn({
      level: 'Warning',
      message,
    }),

    pushError: (message) => store.pushError({
      level: 'Error',
      message,
    }),

    pushInfo: (message) => store.pushInfo({
      level: 'Info',
      message,
    }),

    pushSuccess: (message) => store.pushSuccess({
      level: 'Success',
      message,
    }),

    pop: () => store.popSnack(),

    remove: (id) => store.removeSnack(id),

    snackClass: (snack) => {
      switch (snack.level) {
        case 'Info': return 'bg-info text-white'
        case 'Success': return 'bg-positive'
        case 'Error': return 'bg-negative'
        case 'Warning': return 'bg-warning'
        default:
          return 'bg-primary text-white'
      }
    },
  }
}
