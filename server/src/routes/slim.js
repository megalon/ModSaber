const { Router } = require('express')
const Mod = require('../models/Mod.js')
const { mapModsSlim } = require('../app/mods.js')
const cache = require('../middleware/cache.js')

// Setup Router
const router = Router() // eslint-disable-line

router.get('/new', cache.route(10), async (req, res) => {
  let mods = await mapModsSlim(await Mod.find({ unpublished: false }))
  res.send(mods)
})

router.get('/approved', cache.route(10), async (req, res) => {
  let mods = await mapModsSlim(await Mod.find({ approved: true, unpublished: false }), true)
  res.send(mods)
})

module.exports = router
