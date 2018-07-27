const { Router } = require('express')

// Setup Router
const router = Router() // eslint-disable-line

// Environment Variables
const { SITE_ALERT } = process.env

// Post site-wide alerts
router.get('/alert', (req, res) => {
  if (!SITE_ALERT) return res.sendStatus(204)
  res.send({ alert: SITE_ALERT })
})

module.exports = router
