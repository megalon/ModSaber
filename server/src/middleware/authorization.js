const passport = require('passport')
const requireLogin = passport.authenticate('jwt', { session: false })

/**
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {Function} next Callback
 * @returns {*}
 */
const requireAdmin = (req, res, next) => {
  // Check for login
  if (!req.user) return res.sendStatus(401)

  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)
  else return next()
}

module.exports = { requireLogin, requireAdmin }
