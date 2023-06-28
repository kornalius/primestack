import app from './app'
import { info, error } from './logger'

const host = app.get('host')
const port = app.get('port')

app.listen(port).then(() => {
  info(`Feathers application started on http://${host}:${port}`)
})

process.on('unhandledRejection', (reason) => {
  error(`Unhandled Rejection. ${reason}`)
})
