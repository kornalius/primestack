import { Application } from '@/declarations'
import version from './version/version.service'

export default function (app: Application): void {
  app.configure(version)
}
