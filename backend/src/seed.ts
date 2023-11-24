import * as process from 'process'
import { Application } from '@/declarations'
import { info } from '@/logger'
import users from './services/users/users.seeds'
import plans from './services/plans/plans.seeds'
import groups from './services/groups/groups.seeds'
import tables from './services/tables/tables.seeds'
import actions from './services/actions/actions.seeds'
import forms from './services/forms/forms.seeds'
import blueprints from './services/blueprints/blueprints.seeds'
import menus from './services/menus/menus.seeds'

export default async (app: Application) => {
  const db = await app.get('mongodbClient')
  const collections = await db.collections()

  const args = process.argv

  let names = [
    'users', 'plans', 'groups', 'tables', 'actions', 'forms', 'blueprints', 'menus',
  ]

  const n = args.findIndex((a) => a.startsWith('--names'))
  if (n !== -1) {
    names = args?.[n + 1].split(',').map((n) => n.trim())
  }

  info('Dropping tables in schema...')

  await Promise.all(
    collections
      .filter((c) => names.includes(c.collectionName))
      .map((c) => {
        info(`  - ${c.collectionName}`)
        return c
      })
      .map((c) => c.drop())
  )

  info('Seeding data into tables...')

  const data = {}

  if (names.includes('users')) {
    await users(app, data)
  }
  if (names.includes('plans')) {
    await plans(app, data)
  }

  if (names.includes('groups')) {
    await groups(app, data)
  }

  if (names.includes('tables')) {
    await tables(app, data)
  }

  if (names.includes('actions')) {
    await actions(app, data)
  }

  if (names.includes('forms')) {
    await forms(app, data)
  }

  if (names.includes('blueprints')) {
    await blueprints(app, data)
  }

  if (names.includes('menus')) {
    await menus(app, data)
  }
}
