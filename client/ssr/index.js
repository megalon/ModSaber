/* global __dirname */
import * as path from 'path'
import Loadable from 'react-loadable'
import express, { Router } from 'express'
import serverRenderer from './middleware/renderer.js'
import modMeta from './middleware/modmeta.js'
import mongoose from 'mongoose'

// Express App
const app = express()
const router = Router() // eslint-disable-line

// Proxy Support
app.set('trust proxy', true)
app.use((req, res, next) => {
  res.set('X-Docker-Hostname', process.env.HOSTNAME)
  res.removeHeader('X-Powered-By')
  next()
})

// Connect to Mongo
const MONGO_URL = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/modsaber' : 'mongodb://mongo:27017/modsaber'
mongoose.connect(MONGO_URL, { useNewUrlParser: true })

// Root (/) should always serve our server rendered page
router.use('^/$', serverRenderer)

// Other static resources should just be served as they are
router.use(express.static(
  path.resolve(__dirname, '..', 'build'),
  { maxAge: '30d' },
))

// Handle mod metadata
router.get('/mod/:name/:version?', modMeta, (req, res) => serverRenderer(req, res))
// Handle other routes
router.get('*', (req, res) => serverRenderer(req, res))

// Tell the app to use the above rules
app.use(router)

// Start the app
Loadable.preloadAll().then(() => {
  app.listen(process.env.PORT || 3002)
})
