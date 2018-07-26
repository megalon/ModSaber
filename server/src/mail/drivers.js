const log = require('./log.js')
const mailgun = require('./mailgun.js')

module.exports = driver => driver === 'log' ? log : mailgun
