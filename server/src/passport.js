const passport = require('passport')
const { Strategy: JWTStrategy } = require('passport-jwt')
const { cookieExtractor } = require('./helpers.js')
const Account = require('./models/account.js')

// Environment Variables
const { JWT_SECRET } = process.env

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
      .then(user => cb(null, user))
      .catch(err => cb(err))
  }
))
