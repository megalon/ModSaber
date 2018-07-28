const passport = require('passport')
const { Strategy: JWTStrategy } = require('passport-jwt')
const { cookieExtractor } = require('./helpers.js')
const Account = require('../models/account.js')

// Environment Variables
const { JWT_SECRET, ADMIN_USERNAME } = process.env

// Authenticate with Database
passport.use(Account.createStrategy())

// Authenticate JSON Web Token
passport.use(new JWTStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: JWT_SECRET,
  }, (payload, cb) => {
    // Expiry Check
    let expires = new Date(payload.expires)
    if (new Date() >= expires) return cb(null, false)

    Account.findById(payload.id)
      .then(user => {
        try {
          // Check for token modifications
          if (user.changed > new Date(payload.issued)) return cb(null, false)

          if (user.username === ADMIN_USERNAME) user.admin = true
          return cb(null, user)
        } catch (err) {
          return cb(err)
        }
      })
      .catch(err => cb(err))
  }
))
