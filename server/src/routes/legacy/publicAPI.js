const { Router } = require('express')
const semver = require('semver')
const Account = require('../models/account.js')
const Mod = require('../models/mod.js')
const GameVersion = require('../models/gameversion.js')
const { mapMod } = require('../app/api.js')
const { REDIS_HOST, RESULTS_PER_PAGE } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

// Environment Variables
const { SITE_ALERT } = process.env

router.get('/all/new/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({ unpublished: false }, { page, limit: RESULTS_PER_PAGE, sort: '-created' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/all/approved/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({ approved: true, unpublished: false }, { page, limit: RESULTS_PER_PAGE, sort: '-weight name' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/temp/approved', cache.route(10), async (req, res) => {
  let { docs, pages } = await Mod.paginate({ approved: true, unpublished: false }, { page: 1, limit: 999999, sort: '-weight name' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

// Post site-wide alerts
router.get('/alert', (req, res) => {
  if (!SITE_ALERT) return res.sendStatus(204)
  res.send({ alert: SITE_ALERT })
})

router.get('/gameversions', async (req, res) => {
  let versions = (await GameVersion.find({}).exec())
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(x => ({ id: x._id, value: x.value, manifest: x.manifest }))

  res.send(versions)
})

module.exports = router
