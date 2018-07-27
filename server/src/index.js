const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// App Constants
const { MONGO_URL } = require('./constants.js')
const { PORT, COOKIE_SECRET, SITE_ALERT } = process.env

// Setup Express App
const app = express()
app.set('trust proxy', true)
require('./app/passport.js')
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(COOKIE_SECRET))
app.use((req, res, next) => {
  res.set('X-Docker-Hostname', process.env.HOSTNAME)
  res.removeHeader('X-Powered-By')
  next()
})

// Allow CORS on Dev Server
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.set('Access-Control-Allow-Credentials', 'true')
    res.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')
  }
  next()
})

// Post site-wide alerts
app.get('/api/alert', (req, res) => {
  if (!SITE_ALERT) return res.sendStatus(204)
  res.send({ alert: SITE_ALERT })
})

// Routes
app.use('/registry', require('./routes/registry.js'))
app.use('/auth', require('./routes/auth.js'))
app.use('/api', passport.authenticate('jwt', { session: false }), require('./routes/api.js'))

// Connect to DB
mongoose.connect(MONGO_URL, { useNewUrlParser: true })

// Listen on port 3000
app.listen(PORT || 3000)
