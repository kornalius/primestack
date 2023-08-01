import dayjs from 'dayjs'
import { T18N } from '@/shared/interfaces/commons'

export default (t: T18N, { date }: { date: string }) => (
  (val: string | undefined | null): true | string => (
    !dayjs(val).isBefore(dayjs(date))
      ? t('field_errors.before', { date })
      : true
  )
)
