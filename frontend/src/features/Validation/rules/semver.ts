import { T18N } from '@/shared/interfaces/commons'
import { semver } from '../helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => (
    !val.match(semver)
      ? t('field_errors.semver')
      : true
  )
)
