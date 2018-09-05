const { Router } = require('express')
const Mod = require('../models/Mod.js')
const { mapModsSlim } = require('../app/mods.js')
const { REDIS_HOST } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

router.get('/new', cache.route(10), async (req, res) => {
  let mods = await mapModsSlim(await Mod.find({ unpublished: false }))
  res.send(mods)
})

router.get('/approved', cache.route(10), async (req, res) => {
  let mods = await mapModsSlim(await Mod.find({ approved: true, unpublished: false }), true)
  res.send(mods)
})

module.exports = router
