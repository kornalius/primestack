import { Application } from '@/declarations'
import { info } from '../logger'
import version from './version/version.service'
import users from './users/users.service'

export default function (app: Application): void {
  info('    - Version')
  app.configure(version)

  info('    - Users')
  app.configure(users)
}
