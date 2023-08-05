import { TAction } from '@/shared/interfaces/actions'
import schema from '@/shared/schemas/actions/remove'

export default {
  type: 'remove',
  label: 'Remove',
  description: 'Remove records from a table',
  icon: 'mdi-database-minus',
  color: 'grey-9',
  schema,
} as TAction
