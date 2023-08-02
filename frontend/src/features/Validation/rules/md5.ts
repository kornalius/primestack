import { T18N } from '@/shared/interfaces/commons'
import { md5 } from '../helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !val.match(md5)
      ? t('field_errors.md5')
      : true
  )
)
