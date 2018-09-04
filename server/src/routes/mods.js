const { Router } = require('express')
const Mod = require('../models/mod.js')
const { mapMod, getPendingMods } = require('../app/mods.js')
const { REDIS_HOST, RESULTS_PER_PAGE } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

router.get('/pending', async (req, res) => {
  const mods = await getPendingMods()
  res.send(mods)
})

router.get('/new/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({ unpublished: false }, { page, limit: RESULTS_PER_PAGE, sort: '-created' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/approved/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({ approved: true, unpublished: false }, { page, limit: RESULTS_PER_PAGE, sort: '-weight name' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

module.exports = router
