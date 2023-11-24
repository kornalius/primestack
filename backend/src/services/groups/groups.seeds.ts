import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - groups')

  // eslint-disable-next-line no-param-reassign
  data.groups = {}

  if (!data.plans) {
    const plans = (await app.service('plans').find({
      query: {
        code: { $in: ['free', 'personal', 'business', 'enterprise'] },
      },
    })).data

    // Fetch plans if not seeded previously

    // eslint-disable-next-line no-param-reassign
    data.plans = {
      free: plans.find((p) => p.code === 'free'),
      personal: plans.find((p) => p.code === 'personal'),
      business: plans.find((p) => p.code === 'business'),
      enterprise: plans.find((p) => p.code === 'enterprise'),
    }
  }

  // Administrators Group

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
    maxSettings: -1,
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

  // Free Users Group (use plan mainly)

  // eslint-disable-next-line no-param-reassign
  data.groups.free = await app.service('groups').create({
    name: 'Free',
    description: 'Users without a plan',
    planId: data.plans.free._id.toString(),
    maxShares: 0,
    maxTables: 0,
    maxRecords: 0,
    maxMenus: 0,
    maxForms: 0,
    maxEdits: 0,
    maxFiles: 0,
    maxFileSize: 0,
    maxSettings: 0,
    rules: [
      {
        read: true,
        create: true,
        update: true,
        delete: true,
      },
    ],
  }, { user: data.auth.user })

  // assign this groupId to the free user
  await app.service('users').patch(data.users.test._id, {
    groupId: data.groups.free._id.toString(),
  }, { user: data.auth.user })
}
