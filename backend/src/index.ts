import app from './app'
import { error } from './logger'

const host = app.get('host')
const port = app.get('port')

app.listen(port).then(() => {
  // eslint-disable-next-line no-console
  console.info(`Feathers application started on ${host}:${port}`)
})

process.on('unhandledRejection', (reason) => {
  error(`Unhandled Rejection. ${reason}`)
})
