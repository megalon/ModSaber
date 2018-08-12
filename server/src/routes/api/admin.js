const { Router } = require('express')
const { errors } = require('../../constants.js')
const Account = require('../../models/account.js')
const Mod = require('../../models/mod.js')
const GameVersion = require('../../models/gameversion.js')
const log = require('../../app/logger.js')

// Environment Variables
const { ADMIN_USERNAME } = process.env

// Setup Router
const router = Router() // eslint-disable-line
router.use((req, res, next) => {
  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)
  else return next()
})

router.post('/gameversion', async (req, res) => {
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
    console.error(err)
    return res.sendStatus(500)
  }
})

router.get('/admins', async (req, res) => {
  // Fetch all admins
  let admins = await Account.find({ admin: true }).exec()

  // Add global admin to the mix
  if (ADMIN_USERNAME) {
    let user = await Account.findOne({ username: ADMIN_USERNAME }).exec()
    user.admin = true
    if (user) admins = [...admins, user]
  }

  res.send(
    admins.map(x => {
      let { username, _id } = x
      return { id: _id, username }
    })
  )
})

router.post('/admins/modify', async (req, res) => {
  let { username, action } = req.body

  // Validate Required Fields
  if (!username) return res.status(400).send({ field: 'username', error: errors.MISSING })
  if (!action) return res.status(400).send({ field: 'action', error: errors.MISSING })
  if (!['promote', 'demote'].includes(action)) return res.status(400).send({ field: 'action', error: errors.ACTION_INVALID })

  let user = await Account.findOne({ username }).exec()
  if (!user) return res.sendStatus(404)

  let admin = action === 'promote'
  await user.set({ admin }).save()

  log.info(`Admin status modified - User: ${username} // Action - ${action} [${req.user.username}]`)
  res.sendStatus(200)
})

router.post('/approve/:name/:version', async (req, res) => {
  try {
    let { name, version } = req.params

    // Remove all old approvals
    let mods = await Mod.find({ name }).exec()
    for (let mod of mods) {
      await mod.set({ approved: false }).save() // eslint-disable-line
    }

    let mod = await Mod.findOne({ name, version }).exec()
    if (!mod) return res.sendStatus(404)

    await mod.set({ approved: true }).save()

    log.info(`Approval granted - Name: ${name} // Version: ${version} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/revoke/:name/:version', async (req, res) => {
  try {
    let { name, version } = req.params

    let mod = await Mod.findOne({ name, version }).exec()
    if (!mod) return res.sendStatus(404)

    await mod.set({ approved: false }).save()

    log.info(`Approval revoked - Name: ${name} // Version: ${version} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/weight/:name/:version', async (req, res) => {
  try {
    let { name, version } = req.params
    let { weight: w } = req.body

    // Validate Weight Score
    if (!w) return res.status(400).send({ field: 'weight', error: errors.WEIGHT_INVALID })

    let weight = parseInt(w, 10)
    if (Number.isNaN(weight)) return res.status(400).send({ field: 'weight', error: errors.WEIGHT_INVALID })

    let mod = await Mod.findOne({ name, version }).exec()
    if (!mod) return res.sendStatus(404)

    await mod.set({ weight }).save()

    log.info(`Mod weight set - Name: ${name} // Version: ${version} // Weight: ${weight} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router
