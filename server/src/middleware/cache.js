const redisCache = require('express-redis-cache')
const { REDIS_HOST } = require('../constants.js')
const { CACHE_DRIVER } = process.env

// Check cache driver
const cache = CACHE_DRIVER === 'none' ?
  null :
  redisCache({ host: REDIS_HOST })

const route = (...args) => cache === null ?
  (req, res, next) => next() :
  cache.route(...args)

module.exports = { route }
