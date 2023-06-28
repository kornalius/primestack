import { Application } from '@/declarations'
import { info } from '../logger'
import version from './version/version.service'

export default function (app: Application): void {
  info('    - Version')
  app.configure(version)
}
