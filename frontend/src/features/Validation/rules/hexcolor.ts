import { T18N } from '@/shared/interfaces/commons'
import { hexcolor } from '../helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !val.match(hexcolor)
      ? t('field_errors.hexcolor')
      : true
  )
)
