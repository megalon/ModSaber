module.exports = driver => driver === 'log' ?
  require('./log.js') :
  require('./mailgun.js')
