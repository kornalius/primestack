import app from './app'

const host = app.get('host')
const port = app.get('port')

app.listen(port).then(() => {
  app.get('log')({
    level: 'info',
    message: `Feathers application started on http://${host}:${port}`,
  })
})

process.on('unhandledRejection', (reason) => {
  app.get('log')({
    level: 'error',
    message: `Unhandled Rejection. ${reason}`,
  })
})
