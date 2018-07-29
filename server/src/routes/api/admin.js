const { Router } = require('express')
const { errors } = require('../../constants.js')
const GameVersion = require('../../models/gameversion.js')

// Setup Router
const router = Router() // eslint-disable-line

router.post('/gameversion', async (req, res) => {
  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)

  let { value, manifest, date } = req.body

  // Validate Required Fields
  if (!value) return res.status(400).send({ field: 'value', error: errors.MISSING })
  if (!manifest) return res.status(400).send({ field: 'manifest', error: errors.MISSING })
  if (!date) return res.status(400).send({ field: 'date', error: errors.MISSING })

  try {
    date = new Date(Number.parseInt(date) ? Number.parseInt(date) : date)
    await GameVersion.create({ value, manifest, date })
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
})

module.exports = router
