const redisCache = require('express-redis-cache')
const { CACHE_DRIVER, REDIS_HOST } = require('../constants.js')

// Check cache driver
const cache = CACHE_DRIVER === 'none' ?
  null :
  redisCache({ host: REDIS_HOST })

const route = (...args) => cache === null ?
  (req, res, next) => next() :
  cache.route(...args)

module.exports = { route }
