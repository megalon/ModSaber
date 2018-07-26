const { Router } = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const uuid = require('uuid/v4')
const { plusDays } = require('../app/helpers.js')
const Account = require('../models/account.js')
const mailDriver = require('../mail/drivers.js')

// Setup Router
const router = Router() // eslint-disable-line

// Environment Variables and Constants
const { JWT_SECRET, MAIL_DRIVER } = process.env
const { COOKIE_NAME } = require('../constants.js')

// Mail Driver
const mail = mailDriver(MAIL_DRIVER)

// Authentication Routes
router.post('/register', (req, res) => {
  let { username, password, email } = req.body
  let verifyToken = uuid().replace(/-/g, '')

  Account.register(new Account({ username, email, verifyToken }), password, (err, account) => {
    if (err) {
      console.error(err)
      res.status(400)

      let response = { error: err.name }
      if (err.name === 'ValidationError') response.fields = err.errors

      return res.send(response)
    }

    // Send Verification Email
    let { protocol, headers: { host } } = req
    let verifyURL = `${protocol}://${host}/auth/verify/${verifyToken}`
    mail.sendVerification(username, email, verifyURL)

    let { id } = account
    let expires = plusDays(7)
    const token = jwt.sign({ id, expires }, JWT_SECRET)
    res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

    res.redirect('/')
  })
})

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  let { id } = req.user
  let expires = plusDays(7)

  const token = jwt.sign({ id, expires }, JWT_SECRET)
  res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

  res.redirect('/')
})

// Verify Account
router.get('/verify/:token', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.active) return res.redirect('/')

  let { token } = req.params
  if (req.user.verifyToken === token) await Account.findByIdAndUpdate(req.user.id, { $set: { active: true } }).exec()

  res.redirect('/')
})

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.redirect('/')
})

module.exports = router
