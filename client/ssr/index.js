/* global __dirname */
import * as path from 'path'
import Loadable from 'react-loadable'
import express, { Router } from 'express'
import serverRenderer from './middleware/renderer.js'

// Express App
const app = express()
const router = Router() // eslint-disable-line

// Root (/) should always serve our server rendered page
router.use('^/$', serverRenderer)

// Other static resources should just be served as they are
router.use(express.static(
  path.resolve(__dirname, '..', 'build'),
  { maxAge: '30d' },
))
router.get('*', (req, res) => serverRenderer(req, res))

// Tell the app to use the above rules
app.use(router)

// Start the app
Loadable.preloadAll().then(() => {
  app.listen(process.env.PORT || 3002)
})
