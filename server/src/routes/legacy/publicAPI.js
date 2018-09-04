const { Router } = require('express')
const Mod = require('../models/mod.js')
const { mapMod } = require('../app/api.js')
const { REDIS_HOST } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

router.get('/temp/approved', cache.route(10), async (req, res) => {
  let { docs, pages } = await Mod.paginate({ approved: true, unpublished: false }, { page: 1, limit: 999999, sort: '-weight name' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

module.exports = router
