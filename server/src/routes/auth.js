const { Router } = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { plusDays, waitForMS, randomToken } = require('../app/helpers.js')
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
  let verifyToken = randomToken()

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

    let { id, changed } = account
    let expires = plusDays(7)
    const token = jwt.sign({ id, issued: changed, expires }, JWT_SECRET)
    res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

    res.sendStatus(200)
  })
})

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  let { id } = req.user
  let issued = new Date()
  let expires = plusDays(7)

  const token = jwt.sign({ id, issued, expires }, JWT_SECRET)
  res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

  res.sendStatus(200)
})

// Verify Account
router.get('/verify/:token', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.verified) return res.redirect('/')

  let { token } = req.params
  if (req.user.verifyToken === token) await Account.findByIdAndUpdate(req.user.id, { $set: { verified: true } }).exec()

  res.redirect('/')
})

// Change Password
router.post('/password/change', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { oldPassword, newPassword } = req.body

  if (!oldPassword) return res.status(400).send({ field: 'oldPassword' })
  if (!newPassword) return res.status(400).send({ field: 'newPassword' })

  try {
    let user = await Account.findById(req.user.id).exec()
    await user.changePassword(oldPassword, newPassword)

    let changed = new Date()
    await user.set({ changed }).save()
    await waitForMS(100)

    let { id } = req.user
    let expires = plusDays(7)

    const token = jwt.sign({ id, issued: changed, expires }, JWT_SECRET)
    res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

    res.sendStatus(200)
  } catch (err) {
    if (err.name === 'IncorrectPasswordError') return res.sendStatus(401)

    console.error(err)
    res.sendStatus(500)
  }
})

// Change Password
router.post('/password/reset', async (req, res) => {
  let { email } = req.body

  if (!email) return res.status(400).send({ field: 'email' })

  try {
    let user = await Account.findOne({ email }).exec()
    if (!user) return res.sendStatus(404)

    // Generate Token
    let resetToken = randomToken()
    await user.set({ resetToken }).save()

    // Send Reset Email
    let { protocol, headers: { host } } = req
    let resetURL = `${protocol}://${host}/#/reset/${user.username}/${resetToken}`
    mail.sendReset(user.username, user.email, resetURL)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.sendStatus(200)
})

module.exports = router
