import { T18N } from '@/shared/interfaces/commons'
import { decimal, getLocale } from '@/features/Validation/helpers'

export default (t: T18N) => (
  (val: string | undefined | null): true | string => {
    const float = new RegExp(
      `^(?:[-+])?(?:[0-9]+)?(?:\\${decimal[getLocale()]}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`,
    )
    return !val.match(float)
      ? t('field_errors.float')
      : true
  }
)
