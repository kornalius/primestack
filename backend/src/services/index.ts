import { Application } from '@/declarations'
import { info } from '@/logger'
import health from './health/health.service'
import users from './users/users.service'
import plans from './plans/plans.service'
import tables from './tables/tables.service'
import menus from './menus/menus.service'
import forms from './forms/forms.service'
import actions from './actions/actions.service'

export default function (app: Application): void {
  info('    - Health Check')
  app.configure(health)

  info('    - Users')
  app.configure(users)

  info('    - Plans')
  app.configure(plans)

  info('    - Tables')
  app.configure(tables)

  info('    - Menus')
  app.configure(menus)

  info('    - Forms')
  app.configure(forms)

  info('    - Actions')
  app.configure(actions)
}
