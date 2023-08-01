import { T18N } from '@/shared/interfaces/commons'
import { creditcards } from '../helpers'

export default (t: T18N, { cardtype }: { cardtype: string }) => (
  (val: string | undefined | null): true | string => (
    !val.match(creditcards[cardtype])
      ? t('field_errors.creditcard')
      : true
  )
)
