import app from './app'
import { info, error } from './logger'

const prefix = app.get('prefix')
const host = app.get('host')
const port = app.get('port')

app.listen(port).then(() => {
  info(`Feathers application started on ${prefix}://${host}:${port}`)
})

process.on('unhandledRejection', (reason) => {
  error(`Unhandled Rejection. ${reason}`)
})
