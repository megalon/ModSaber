const { Router } = require('express')
const Mod = require('../models/mod.js')
const { mapMod } = require('../app/mods.js')
const { REDIS_HOST } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

router.get('/api/public/temp/approved', cache.route(10), async (req, res) => {
  try {
    let { docs, pages } = await Mod.paginate({ approved: true, unpublished: false }, { page: 1, limit: 999999, sort: '-weight name' })
    let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
    let lastPage = pages - 1

    res.send({ mods, lastPage })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router
