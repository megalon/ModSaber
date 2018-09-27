const { Router } = require('express')
const { errors } = require('../constants.js')
const log = require('../app/logger.js')
const GameVersion = require('../models/GameVersion.js')
const { requireLogin, requireAdmin } = require('../middleware/authorization.js')

// Setup Router
const router = Router() // eslint-disable-line

// Environment Variables
const { SITE_ALERT, SITE_ALERT_STYLE } = process.env

// Post site-wide alerts
router.get('/alert', (req, res) => {
  if (!SITE_ALERT) return res.sendStatus(204)
  res.send({ text: SITE_ALERT, style: SITE_ALERT_STYLE ? SITE_ALERT_STYLE : 'warning' })
})

router.get('/gameversions', async (req, res) => {
  let versions = (await GameVersion.find({}).exec())
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(x => ({ id: x._id, value: x.value, manifest: x.manifest }))

  res.send(versions)
})

router.post('/gameversions', requireLogin, requireAdmin, async (req, res) => {
  let { value, manifest, date } = req.body

  // Validate Required Fields
  if (!value) return res.status(400).send({ field: 'value', error: errors.MISSING })
  if (!manifest) return res.status(400).send({ field: 'manifest', error: errors.MISSING })
  if (!date) return res.status(400).send({ field: 'date', error: errors.MISSING })

  try {
    date = new Date(Number.parseInt(date) ? Number.parseInt(date) : date)
    await GameVersion.create({ value, manifest, date })

    log.info(`Game Version issued - Value: ${value} // Manifest: ${manifest} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) return res.sendStatus(400)

    console.error(err)
    return res.sendStatus(500)
  }
})

module.exports = router
