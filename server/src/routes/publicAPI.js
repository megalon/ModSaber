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

/**
 * @typedef {Object} ModShort
 * @property {string} name
 * @property {string[]} versions
 */

/**
 * @param {any} mods Mods Model
 * @returns {Promise.<ModShort[]>}
 */
const mapModsSlim = mods => {
  let final = []

  for (let mod of mods) {
    let found = final.find(x => x.name === mod.name)
    if (!found) {
      // Create new entry in the array
      final = [...final, {
        name: mod.name,
        title: mod.title,
        author: mod.author,
        created: new Date(mod.created),
        versions: [mod.version],
      }]
    } else {
      // Edit the existing entry
      found.versions = [...found.versions, mod.version]
        .sort(semver.rcompare)
      if (found.versions[0] === mod.version) {
        found.author = mod.author
        found.created = new Date(mod.created)
      }
    }
  }

  return Promise.all(
    final
      .sort((a, b) => b.created - a.created)
      .map(async mod => {
        let author = await Account.findById(mod.author)
        mod.author = author ? author.username : ''
        mod.created = undefined
        return mod
      })
  )
}

router.get('/all/new/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({}, { page, limit: RESULTS_PER_PAGE, sort: '-created' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/all/approved/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({ approved: true }, { page, limit: RESULTS_PER_PAGE, sort: '-created' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/slim/new', cache.route(10), async (req, res) => {
  let mods = await mapModsSlim(await Mod.find({}))
  res.send(mods)
})

router.get('/slim/approved', cache.route(10), async (req, res) => {
  let mods = await mapModsSlim(await Mod.find({ approved: true }))
  res.send(mods)
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
