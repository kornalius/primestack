import { TAction } from '@/shared/interfaces/actions'
import schema from '@/shared/schemas/actions/patch'

export default {
  type: 'patch',
  label: 'Patch',
  description: 'Patch records in a table',
  icon: 'mdi-database-edit',
  color: 'grey-9',
  schema,
} as TAction
