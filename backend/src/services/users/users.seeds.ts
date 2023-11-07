import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - users')

  // eslint-disable-next-line no-param-reassign
  data.users = {}
  // eslint-disable-next-line no-param-reassign
  data.users.admin = await app.service('users').create({
    email: app.get('adminEmail'),
    password: app.get('adminPwd'),
    firstname: app.get('adminFirstname'),
    lastname: app.get('adminLastname'),
    maxShares: 0,
    maxTables: 0,
    maxMenus: 0,
    maxForms: 0,
    maxEdits: 0,
    maxRecords: 0,
    maxFiles: 0,
    maxFileSize: 0,
    maxSettings: 0,
    rules: [],
    settings: {},
  })

  // eslint-disable-next-line no-param-reassign
  data.auth = await app.service('authentication').create({
    strategy: 'local',
    email: app.get('adminEmail'),
    password: app.get('adminPwd')
  })
}
