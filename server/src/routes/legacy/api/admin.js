const { Router } = require('express')
const { errors } = require('../../constants.js')
const Account = require('../../models/account.js')
const Mod = require('../../models/mod.js')
const log = require('../../app/logger.js')
const { approvedPayload, revokedPayload, postWebhook } = require('../../app/helpers.js')

// Setup Router
const router = Router() // eslint-disable-line
router.use((req, res, next) => {
  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)
  else return next()
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

router.post('/revoke/:name/:version', async (req, res) => {
  try {
    let { name, version } = req.params

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

router.post('/category/:name/:version', async (req, res) => {
  try {
    let { name, version } = req.params
    let { category } = req.body

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
