// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { MongoClient } from 'mongodb'
import type { Db } from 'mongodb'
import type { Application } from './declarations'
import { info } from './logger'

declare module './declarations' {
  interface Configuration {
    mongodbClient: Promise<Db>
  }
}

export default (app: Application) => {
  const url = app.get('mongodb') as string
  info(`  - connecting to ${url}...`)
  const database = new URL(url).pathname.substring(1)
  const mongoClient = MongoClient
    .connect(url)
    .then((client) => client.db(database))

  app.set('mongodbClient', mongoClient)
}
