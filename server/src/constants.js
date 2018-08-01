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
    FILE_BLANK: 'file_blank',
    FILE_CONTAINS_BLOCKED: 'file_contains_blocked',
    GAMEVERSION_INVALID: 'gameversion_invalid',
    ACTION_INVALID: 'action_invalid',
    WEIGHT_INVALID: 'weight_invalid',
  },
  RESULTS_PER_PAGE: 5,
  BLOCKED_EXTENSIONS: [
    '.jar',
    '.exe',
    '.msi',
    '.com',
    '.bat',
    '.cmd',
    '.nt',
    '.scr',
    '.ps1',
    '.psm1',
    '.sh',
    '.bash',
    '.bsh',
    '.csh',
    '.bash_profile',
    '.bashrc',
    '.profile',
  ],
}
