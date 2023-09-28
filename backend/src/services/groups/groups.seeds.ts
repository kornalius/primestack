import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - groups')

  // eslint-disable-next-line no-param-reassign
  data.groups = {}
  // eslint-disable-next-line no-param-reassign
  data.groups.admin = await app.service('groups').create({
    name: 'Admin',
    description: 'Administrators',
    planId: data.plans.enterprise._id.toString(),
    maxShares: -1,
    maxTables: -1,
    maxRecords: -1,
    maxMenus: -1,
    maxForms: -1,
    maxEdits: -1,
    maxFiles: -1,
    maxFileSize: -1,
    rules: [
      {
        read: true,
        create: true,
        update: true,
        delete: true,
      },
    ],
  }, { user: data.auth.user })

  // assign this groupId to the admin user
  await app.service('users').patch(data.users.admin._id, {
    groupId: data.groups.admin._id.toString(),
  }, { user: data.auth.user })
}
