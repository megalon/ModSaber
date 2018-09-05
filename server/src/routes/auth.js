const { Router } = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { plusDays, waitForMS, randomToken } = require('../app/helpers.js')
const Account = require('../models/Account.js')
const mailDriver = require('../mail/drivers.js')
const log = require('../app/logger.js')

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

  let changed = new Date()
  Account.register(new Account({ username, email, verifyToken, changed }), password, (err, account) => {
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
    const token = jwt.sign({ id, issued: changed, expires }, JWT_SECRET)
    res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

    log.info(`Registering new account [${username}]`)
    res.sendStatus(200)
  })
})

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  let { id, username } = req.user
  let issued = new Date()
  let expires = plusDays(7)

  const token = jwt.sign({ id, issued, expires }, JWT_SECRET)
  res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

  log.info(`Auth token issued for login [${username}]`)
  res.sendStatus(200)
})

// Verify Account
router.get('/verify/:token', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { verified, verifyToken, id, username } = req.user
  if (verified) return res.redirect('/')

  let { token } = req.params
  if (verifyToken === token) await Account.findByIdAndUpdate(id, { $set: { verified: true } }).exec()

  log.info(`User account verified [${username}]`)
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

    let { id, username } = req.user
    let expires = plusDays(7)

    const token = jwt.sign({ id, issued: changed, expires }, JWT_SECRET)
    res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

    log.error(`User password changed [${username}]`)
    res.sendStatus(200)
  } catch (err) {
    if (err.name === 'IncorrectPasswordError') return res.sendStatus(401)

    console.error(err)
    res.sendStatus(500)
  }
})

// Change Password
router.post('/email/change', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let { email, password } = req.body

  if (!email) return res.status(400).send({ field: 'email' })
  if (!password) return res.status(400).send({ field: 'password' })

  try {
    let user = await Account.findById(req.user.id).exec()
    let { error } = await user.authenticate(password)

    if (error) {
      if (error.name === 'IncorrectPasswordError') return res.sendStatus(401)

      console.error(error)
      return res.sendStatus(500)
    }

    let verifyToken = randomToken()
    await user.set({ email, verifyToken, verified: false }).save()

    // Send Verification Email
    let { protocol, headers: { host } } = req
    let verifyURL = `${protocol}://${host}/auth/verify/${verifyToken}`
    mail.sendVerification(user.username, email, verifyURL)

    log.info(`User email changed [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
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
    let resetURL = `${protocol}://${host}/reset/${user.username}/${resetToken}`
    mail.sendReset(user.username, user.email, resetURL)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/reset', async (req, res) => {
  let { username, newPassword, resetToken } = req.body

  if (!username) return res.status(400).send({ field: 'username' })
  if (!newPassword) return res.status(400).send({ field: 'newPassword' })
  if (!resetToken) return res.status(400).send({ field: 'resetToken' })

  let user = await Account.findOne({ username, resetToken }).exec()
  if (!user) return res.sendStatus(401)

  let changed = new Date()

  await user.setPassword(newPassword)
  await user.set({ resetToken: undefined })
  await user.set({ changed })
  await user.save()

  let { id } = user
  let expires = plusDays(7)

  const token = jwt.sign({ id, issued: changed, expires }, JWT_SECRET)
  res.cookie(COOKIE_NAME, token, { expires, httpOnly: true })

  res.sendStatus(200)
})

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.sendStatus(200)
})

module.exports = router
