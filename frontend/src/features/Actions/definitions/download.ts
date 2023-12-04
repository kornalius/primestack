// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalDownload from '@/shared/actions/download'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Download from '../components/download.vue'

export default {
  ...globalDownload,
  icon: 'mdi-folder-download',
  color: 'orange-3',
  component: Download,
  description: 'actions.download.description',
  childrenMessage: 'actions.download.childrenMessage',
  exec: async (ctx) => {
    const href = anyToString(getProp(ctx.href, ctx))
    const fileDownloadLink = document.createElement('a')
    fileDownloadLink.setAttribute('href', href)
    fileDownloadLink.click()
  },
  result: (): string[] => ([]),
} as TFrontAction
