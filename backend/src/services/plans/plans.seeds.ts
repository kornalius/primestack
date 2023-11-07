import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'

export default async (app: Application, data: AnyData) => {
  // eslint-disable-next-line no-param-reassign
  data.plans = {}
  // eslint-disable-next-line no-param-reassign
  data.plans.free = await app.service('plans').create({
    code: 'free',
    name: 'Free',
    description: 'Free plan',
    price: 0.0,
    items: [
      '1 share',
      '5 tables',
      '5 menus',
      '5 forms',
      '5 user\'s setting keys',
      '100 records per table',
      '25 files',
      '10MB maximum file size'
    ],
    maxShares: 1,
    maxTables: 5,
    maxMenus: 5,
    maxForms: 5,
    maxEdits: -1,
    maxRecords: 100,
    maxFiles: 25,
    maxFileSize: 10000,
    maxSettings: 5,
    bestValue: false,
    color: '',
  })

  // eslint-disable-next-line no-param-reassign
  data.plans.personal = await app.service('plans').create({
    code: 'personal',
    name: 'Personal',
    description: 'Personal plan',
    price: 9.99,
    items: [
      '5 shares',
      '15 tables',
      '10 menus',
      '15 forms',
      '10 user\'s setting keys',
      '10,000 records per table',
      '100 files',
      '25MB maximum file size'
    ],
    maxShares: 5,
    maxTables: 15,
    maxMenus: 10,
    maxForms: 15,
    maxEdits: -1,
    maxRecords: 10000,
    maxFiles: 100,
    maxFileSize: 25000,
    maxSettings: 10,
    bestValue: true,
    color: 'blue-1',
  })

  // eslint-disable-next-line no-param-reassign
  data.plans.business = await app.service('plans').create({
    code: 'business',
    name: 'Business',
    description: 'Business plan',
    price: 99.99,
    items: [
      '25 shares',
      '100 tables',
      '25 menus',
      '100 forms',
      '25 user\'s setting keys',
      '1,000,000 records per table',
      '5000 files',
      '50MB maximum file size'
    ],
    maxShares: 5,
    maxTables: 15,
    maxMenus: 10,
    maxForms: 15,
    maxEdits: -1,
    maxRecords: 1000000,
    maxFiles: 5000,
    maxFileSize: 50000,
    maxSettings: 25,
    bestValue: false,
    color: '',
  })

  // eslint-disable-next-line no-param-reassign
  data.plans.enterprise = await app.service('plans').create({
    code: 'enterprise',
    name: 'Enterprise',
    description: 'Enterprise plan',
    price: 399.99,
    items: [
      '100 shares',
      'Unlimited tables',
      'Unlimited menus',
      'Unlimited forms',
      '100 user\'s setting keys',
      'Unlimited records per table',
      '10,000 files',
      '100MB maximum file size'
    ],
    maxShares: 100,
    maxTables: -1,
    maxMenus: -1,
    maxForms: -1,
    maxEdits: -1,
    maxRecords: -1,
    maxFiles: 10000,
    maxFileSize: 100000,
    maxSettings: 100,
    bestValue: false,
    color: 'orange-1',
  })
}
