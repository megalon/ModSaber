const { Router } = require('express')
const semver = require('semver')
const Mod = require('../models/mod.js')
const { mapMod } = require('../app/api.js')
const { REDIS_HOST } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

router.get('/:name', async (req, res) => {
  let { name } = req.params
  let mods = await Mod.find({ name, unpublished: false }).exec()

  if (mods.length === 0) return res.sendStatus(404)
  let [latest] = mods.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0 || semver.rcompare(a.version, b.version))

  res.redirect(`/registry/${name}/${latest.version}`)
})

router.get('/:name/:version', cache.route({ expire: { 200: 5 * 60, xxx: 1 } }), async (req, res) => {
  let { name: n, version: v } = req.params
  let mod = await Mod.findOne({ name: n, version: v, unpublished: false }).exec()

  if (!mod) return res.sendStatus(404)

  res.send(await mapMod(mod, req))
})

module.exports = router
