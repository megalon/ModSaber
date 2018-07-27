const { Router } = require('express')
const GameVersion = require('../models/gameversion.js')

// Setup Router
const router = Router() // eslint-disable-line

// Environment Variables
const { SITE_ALERT } = process.env

// Post site-wide alerts
router.get('/alert', (req, res) => {
  if (!SITE_ALERT) return res.sendStatus(204)
  res.send({ alert: SITE_ALERT })
})

router.get('/gameversions', async (req, res) => {
  let versions = (await GameVersion.find({}).exec())
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(x => ({ value: x.value, manifest: x.manifest }))

  res.send(versions)
})

module.exports = router
