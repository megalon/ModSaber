const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// App Constants
const { MONGO_URL } = require('./constants.js')
const { COOKIE_SECRET } = process.env

// Setup Express App
const app = express()
require('./app/passport.js')
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(COOKIE_SECRET))

// Routes
app.use('/auth', require('./routes/auth.js'))
app.use('/api', passport.authenticate('jwt', { session: false }), require('./routes/api.js'))

// Connect to DB
mongoose.connect(MONGO_URL, { useNewUrlParser: true })

// Listen on port 3000
app.listen(3000)
