const path = require('path')

module.exports = {
  MONGO_URL: process.env.NODE_ENV === 'development' ? 'mongodb://localhost/modsaber' : 'mongodb://mongo/modsaber',
  COOKIE_NAME: 'jwt',
  STORE_PATH: path.join(__dirname, 'store'),
  errors: {
    MISSING: 'missing_field',
    SEMVER_INVALID: 'semver_invalid',
    FILE_WRONG_TYPE: 'file_wrong_type',
  },
}
