const { Router } = require('express')
const semver = require('semver')
const Mod = require('../models/mod.js')
const GameVersion = require('../models/gameversion.js')
const { REDIS_HOST } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

// Environment Variables
const { SITE_ALERT } = process.env

/**
 * @typedef {Object} ModShort
 * @property {string} name
 * @property {string[]} versions
 */

/**
 * @param {any} mods Mods Model
 * @returns {ModShort[]}
 */
const mapMods = mods => {
  let final = []
  for (let mod of mods) {
    let found = final.find(x => x.name === mod.name)
    if (!found) {
      // Create new entry in the array
      final = [...final, { name: mod.name, versions: [mod.version] }]
    } else {
      // Edit the existing entry
      found.versions = [...found.versions, mod.version]
        .sort(semver.rcompare)
    }
  }
  return final
}

router.get('/slim/new/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({}, { page, limit: 10 })
  let mods = mapMods(docs)
  let last = pages - 1

  res.send({ mods, last })
})

router.get('/slim/approved/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({ approved: true }, { page, limit: 10 })
  let mods = mapMods(docs)
  let last = pages - 1

  res.send({ mods, last })
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
