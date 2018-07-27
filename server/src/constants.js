const path = require('path')
const dev = process.env.NODE_ENV === 'development'

module.exports = {
  MONGO_URL: dev ? 'mongodb://localhost:27017/modsaber' : 'mongodb://mongo:27017/modsaber',
  REDIS_HOST: dev ? 'localhost' : 'redis',
  COOKIE_NAME: 'jwt',
  STORE_PATH: path.join(__dirname, 'store'),
  errors: {
    MISSING: 'missing_field',
    SEMVER_INVALID: 'semver_invalid',
    FILE_WRONG_TYPE: 'file_wrong_type',
    GAMEVERSION_INVALID: 'gameversion_invalid',
  },
}
