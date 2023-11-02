import { Application } from '@/declarations'
import { info } from '@/logger'
import health from './health/health.service'
import events from './events/events.service'
import groups from './groups/groups.service'
import plans from './plans/plans.service'
import shares from './shares/shares.service'
import users from './users/users.service'
import tables from './tables/tables.service'
import stats from './stats/stats.service'
import menus from './menus/menus.service'
import forms from './forms/forms.service'
import actions from './actions/actions.service'
import files from './files/files.service'
import uploads from './uploads/uploads.service'
import blueprints from './blueprints/blueprints.service'

export default function (app: Application): void {
  info('    - Health Check')
  app.configure(health)

  info('    - Events')
  app.configure(events)

  info('    - Groups')
  app.configure(groups)

  info('    - Plans')
  app.configure(plans)

  info('    - Shares')
  app.configure(shares)

  info('    - Users')
  app.configure(users)

  info('    - Tables')
  app.configure(tables)

  info('    - Stats')
  app.configure(stats)

  info('    - Menus')
  app.configure(menus)

  info('    - Forms')
  app.configure(forms)

  info('    - Actions')
  app.configure(actions)

  info('    - Blueprints')
  app.configure(blueprints)

  info('    - Uploads')
  app.configure(uploads)

  info('    - Files')
  app.configure(files)
}
