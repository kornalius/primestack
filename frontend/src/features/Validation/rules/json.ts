import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => {
    try {
      JSON.parse(val)
      return true
    } catch (e) {
      return t('field_errors.json')
    }
  }
)
