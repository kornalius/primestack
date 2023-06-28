import {
  createLogger, format, Logger, transports, config
} from 'winston'
import { Application } from '@/declarations'

const messagesToIgnore: string[] = []

let winstonLogger: Logger

export const info = (message: string): void => {
  winstonLogger.info(message)
}

export const error = (message: string): void => {
  winstonLogger.error(message)
}

export default (app: Application): Logger => {
  if (!winstonLogger && app) {
    const ignorePrivate = format((info) => {
      if (info.private) {
        return false
      }
      return info
    })

    const ignoreMessages = format((info) => {
      if (messagesToIgnore.includes(info.message)) {
        return false
      }
      return info
    })

    const customTransports = [
      new transports.Console({
        format: ignorePrivate(),
      })
    ]

    // Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
    winstonLogger = createLogger({
      // To see more detailed errors, change this to 'debug'
      level: app.get('debug') || 'info',
      levels: config.npm.levels,
      format: format.combine(
        ignoreMessages(),
        format.splat(),
        format.errors({ stack: true }),
        format.colorize(),
        format.timestamp(),
        format.printf(({
          level,
          message,
          timestamp,
          stack
        }) => {
          if (stack) {
            // print log trace
            return `${timestamp} ${level}: ${message} - ${stack}`
          }
          return `${timestamp} ${level}: ${message}`
        }),
      ),
      transports: customTransports,
    })
  }

  return winstonLogger
}
