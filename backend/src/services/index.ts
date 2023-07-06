import { Application } from '@/declarations'
import { info } from '@/logger'
import health from './health/health.service'
import users from './users/users.service'
import schemas from './schemas/schemas.service'

export default function (app: Application): void {
  info('    - Health Check')
  app.configure(health)

  info('    - Users')
  app.configure(users)

  info('    - Schemas')
  app.configure(schemas)
}
