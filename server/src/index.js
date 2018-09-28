const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const log = require('./app/logger.js')
const devCORS = require('./middleware/cors.js')

// Load from .env file
dotenv.config()

// App Constants
const { MONGO_URL } = require('./constants.js')
const { PORT, COOKIE_SECRET } = process.env

// Setup Express App
const app = express()
app.set('trust proxy', true)
require('./app/passport.js')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser(COOKIE_SECRET))
app.use((req, res, next) => {
  res.set('X-Docker-Hostname', process.env.HOSTNAME)
  res.removeHeader('X-Powered-By')
  next()
})

// Only log on dev server
if (process.env.NODE_ENV === 'development') app.use(morgan('combined'))

// Allow CORS on Dev Server
app.use(devCORS)

// Routes
app.use('/registry', require('./routes/registry.js'))
app.use('/auth', require('./routes/auth.js'))

// API Routes
const API_VERSION = '1.0'
app.use(`/api/v${API_VERSION}/admin`, require('./routes/admin.js'))
app.use(`/api/v${API_VERSION}/files`, require('./routes/files.js'))
app.use(`/api/v${API_VERSION}/mods`, require('./routes/mods.js'))
app.use(`/api/v${API_VERSION}/slim`, require('./routes/slim.js'))
app.use(`/api/v${API_VERSION}/site`, require('./routes/site.js'))
app.use(`/api/v${API_VERSION}/users`, require('./routes/users.js'))

// Connect to DB
mongoose.set('useCreateIndex', true)
mongoose.connect(MONGO_URL, { useNewUrlParser: true })

// Listen on port 3000
app.listen(PORT || 3000, () => {
  log.info('------------------------')
  log.info('ModSaber Backend: ONLINE')
})
