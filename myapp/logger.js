const pino = require('pino')
const config = require('./config')

const isDev = process.env.NODE_ENV !== 'production'

const transport = isDev
    ? {target: 'pino-pretty', options: { colorize: true }} : undefined;

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport
})

module.exports = logger;