const { Router } = require('express')
const { errors } = require('../constants.js')
const Account = require('../models/Account.js')
const Mod = require('../models/Mod.js')
const log = require('../app/logger.js')
const { requireLogin, requireAdmin } = require('../middleware/authorization.js')
const { approvedPayload, revokedPayload, postWebhook } = require('../app/helpers.js')

// Setup Router
const router = Router() // eslint-disable-line
router.use(requireLogin)
router.use(requireAdmin)

router.post('/approve-mod', async (req, res) => {
  try {
    let { name, version } = req.body

    // Validate Required Fields
    if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
    if (!version) return res.status(400).send({ field: 'version', error: errors.MISSING })

    // Remove all old approvals
    let mods = await Mod.find({ name }).exec()
    for (let mod of mods) {
      await mod.set({ approved: false }).save() // eslint-disable-line
    }

    let mod = await Mod.findOne({ name, version }).exec()
    if (!mod) return res.sendStatus(404)

    await mod.set({ approved: true }).save()

    try {
      // Map Author
      const payloadMod = {
        name: mod.name,
        version: mod.version,
        title: mod.title,
        author: (await Account.findById(mod.author).exec()).username || '',
      }

      // Post to webhook
      const payload = approvedPayload(payloadMod, req.user.username)
      await postWebhook(payload)
    } catch (err) {
      // Silently fail
      console.error(err)
    }

    log.info(`Approval granted - Name: ${name} // Version: ${version} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/revoke-approval', async (req, res) => {
  try {
    let { name, version } = req.body

    // Validate Required Fields
    if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
    if (!version) return res.status(400).send({ field: 'version', error: errors.MISSING })

    let mod = await Mod.findOne({ name, version }).exec()
    if (!mod) return res.sendStatus(404)

    await mod.set({ approved: false }).save()

    try {
      // Map Author
      const payloadMod = {
        name: mod.name,
        version: mod.version,
        title: mod.title,
        author: (await Account.findById(mod.author).exec()).username || '',
      }

      // Post to webhook
      const payload = revokedPayload(payloadMod, req.user.username)
      await postWebhook(payload)
    } catch (err) {
      // Silently fail
      console.error(err)
    }

    log.info(`Approval revoked - Name: ${name} // Version: ${version} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/set-weight', async (req, res) => {
  try {
    let { name, version, weight: w } = req.body

    // Validate Required Fields
    if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
    if (!version) return res.status(400).send({ field: 'version', error: errors.MISSING })

    // Validate Weight Score
    if (!w) return res.status(400).send({ field: 'weight', error: errors.MISSING })

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

router.post('/set-category', async (req, res) => {
  try {
    let { name, version, category } = req.body

    // Validate Required Fields
    if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
    if (!version) return res.status(400).send({ field: 'version', error: errors.MISSING })

    // Validate Weight Score
    if (!category) return res.status(400).send({ field: 'category', error: errors.MISSING })

    if (category.length > 25) return res.status(400).send({ field: 'category', error: errors.CATEGORY_INVALID })

    let mod = await Mod.findOne({ name, version }).exec()
    if (!mod) return res.sendStatus(404)

    await mod.set({ category }).save()

    log.info(`Mod category set - Name: ${name} // Version: ${version} // Category: ${category} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router
