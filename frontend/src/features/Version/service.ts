import { useInstanceDefaults } from 'feathers-pinia'
import { VersionInterface } from './interfaces'

export default {
  setupInstance: (data: VersionInterface): VersionInterface => (
    useInstanceDefaults({ version: '' }, data)
  ),
}
