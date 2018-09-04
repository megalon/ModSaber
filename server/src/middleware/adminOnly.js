/**
 * @param {Request} req Request
 * @param {Response} res Response
 * @param {Function} next Callback
 * @returns {*}
 */
const adminOnly = (req, res, next) => {
  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)
  else return next()
}

module.exports = adminOnly
