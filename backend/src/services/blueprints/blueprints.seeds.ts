import { Application } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'

export default async (app: Application, data: AnyData) => {
  info('  - blueprints')

  // eslint-disable-next-line no-param-reassign
  data.blueprints = await app.service('blueprints').create({
    list: [],
  }, { user: data.auth.user })
}
