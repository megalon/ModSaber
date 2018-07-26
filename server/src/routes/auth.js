const { Router } = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { plusDays } = require('../app/helpers.js')
const Account = require('../models/account.js')

// Setup Router
const router = Router() // eslint-disable-line

// Environment Variables and Constants
const { JWT_SECRET } = process.env
const { COOKIE_NAME } = require('../constants.js')

// Authentication Routes
router.post('/register', (req, res) => {
  let { username, password, email } = req.body
  Account.register(new Account({ username, email }), password, (err, account) => {
    if (err) {
      console.error(err)
      res.status(400)

      let response = { error: err.name }
      if (err.name === 'ValidationError') {
        response.fields = err.errors
      }

      return res.send(response)
    }

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

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.redirect('/')
})

module.exports = router
