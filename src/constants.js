module.exports = {
  MONGO_URL: process.env.NODE_ENV === 'development' ? 'mongodb://localhost/modsaber' : 'mongodb://mongo/modsaber',
  COOKIE_NAME: 'jwt',
  errors: {
    MISSING: 'missing_field',
    SEMVER_INVALID: 'semver_invalid',
    FILE_WRONG_TYPE: 'file_wrong_type',
  },
}
