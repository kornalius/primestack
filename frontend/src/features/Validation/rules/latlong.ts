import { T18N } from '@/shared/interfaces/commons'
import {
  lat, latDMS, long, longDMS,
} from '../helpers'

export default (t: T18N, { checkDMS }: { checkDMS: boolean }) => (
  (val: string | undefined | null): true | string => {
    let valid = false

    if (val.includes(',')) {
      const pair = val.split(',')
      if (pair.length === 2 && pair[0].startsWith('(') && pair[1].endsWith(')')) {
        if (checkDMS) {
          valid = latDMS.test(pair[0]) && longDMS.test(pair[1])
        } else {
          valid = lat.test(pair[0]) && long.test(pair[1])
        }
      }
    }

    return !valid
      ? t('field_errors.latlong')
      : true
  }
)
