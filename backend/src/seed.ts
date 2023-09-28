import { Application } from '@/declarations'
import { info } from '@/logger'
import users from './services/users/users.seeds'
import plans from './services/plans/plans.seeds'
import groups from './services/groups/groups.seeds'
import tables from './services/tables/tables.seeds'
import actions from './services/actions/actions.seeds'
import forms from './services/forms/forms.seeds'
import menus from './services/menus/menus.seeds'

export default async (app: Application) => {
  info('Dropping all tables in schema...')

  const db = await app.get('mongodbClient')
  const collections = await db.collections()

  await Promise.all(collections.map((c) => c.drop()))

  info('Seeding data into tables...')

  const data = {}

  await users(app, data)
  await plans(app, data)
  await groups(app, data)
  await tables(app, data)
  await actions(app, data)
  await forms(app, data)
  await menus(app, data)
}
