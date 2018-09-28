const { Router } = require('express')
const semver = require('semver')
const Mod = require('../models/Mod.js')
const { mapMod } = require('../app/mods.js')
const cache = require('../middleware/cache.js')

// Setup Router
const router = Router() // eslint-disable-line

router.get('/:name', async (req, res) => {
  let { name } = req.params
  let mods = await Mod.find({ name, unpublished: false, approved: true }).exec()

  if (mods.length === 0) return res.sendStatus(404)
  let [latest] = mods.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0 || semver.rcompare(a.version, b.version))

  res.redirect(`/registry/${name}/${latest.version}`)
})

router.get('/:name/:version', cache.route({ expire: { 200: 10, xxx: 1 } }), async (req, res) => {
  let { name: n, version: v } = req.params
  let mod = await Mod.findOne({ name: n, version: v, unpublished: false }).exec()

  if (!mod) return res.sendStatus(404)
  res.send(await mapMod(mod, req))
})

module.exports = router
