const { join } = require('path')
const { FileLogger } = require('fancylog')

let log = new FileLogger(join(__dirname, '..', 'logs', 'modsaber.log'))
module.exports = log
