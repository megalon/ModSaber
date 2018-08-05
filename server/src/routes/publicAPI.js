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
 * @param {boolean} [weighted] Include weights in the results
 * @returns {Promise.<ModShort[]>}
 */
const mapModsSlim = (mods, weighted = false) => {
  let final = []

  for (let mod of mods) {
    let found = final.find(x => x.name === mod.name)
    if (!found) {
      // Create new entry in the array
      final = [...final, {
        name: mod.name,
        title: mod.title,
        author: mod.author,
        tag: mod.tag,
        created: new Date(mod.created),
        versions: [mod.version],
        weight: weighted ? mod.weight : undefined,
      }]
    } else {
      // Edit the existing entry
      found.versions = [...found.versions, mod.version]
        .sort(semver.rcompare)
      if (found.versions[0] === mod.version) {
        found.author = mod.author
        found.created = new Date(mod.created)
        found.weight = weighted ? mod.weight : undefined
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

  let { docs, pages } = await Mod.paginate({ unpublished: false }, { page, limit: RESULTS_PER_PAGE, sort: '-created' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/all/approved/:page?', cache.route(10), async (req, res) => {
  let page = Number.parseInt(req.params.page, 10) === Number.NaN ? 0 : parseInt(req.params.page, 10) || 0
  if (page < 0) page = 0
  page++

  let { docs, pages } = await Mod.paginate({ approved: true, unpublished: false }, { page, limit: RESULTS_PER_PAGE, sort: '-weight' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/temp/approved', cache.route(10), async (req, res) => {
  let { docs, pages } = await Mod.paginate({ approved: true, unpublished: false }, { page: 1, limit: 999999, sort: '-weight' })
  let mods = await Promise.all(docs.map(mod => mapMod(mod, req)))
  let lastPage = pages - 1

  res.send({ mods, lastPage })
})

router.get('/slim/new', cache.route(10), async (req, res) => {
  let mods = await mapModsSlim(await Mod.find({ unpublished: false }))
  res.send(mods)
})

router.get('/slim/approved', cache.route(10), async (req, res) => {
  let mods = (await mapModsSlim(await Mod.find({ approved: true, unpublished: false }), true))
    .sort((a, b) => b.weight - a.weight)
    .map(mod => {
      mod.weight = undefined
      return mod
    })

  res.send(mods)
})

router.get('/pending', async (req, res) => {
  let search = (await Mod.find({ unpublished: false }))
    .sort((a, b) => semver.rcompare(a.version, b.version))

  // Setup places to map data
  let raw = {}
  let filtered = []

  // Map each mod into own objects
  for (let mod of search) {
    if (!raw[mod.name]) raw[mod.name] = []
    raw[mod.name] = [...raw[mod.name], mod]
  }

  // Find the most recent unapproved entry
  for (let pair of Object.entries(raw)) {
    let [, value] = pair

    for (let i in value) {
      let mod = value[i]

      // If the most recent version is approved, ignore
      if (mod.approved && i === '0') break

      // If a mod version is approved, ignore but continue
      if (mod.approved) continue

      // Find the first version that needs approval and stop searching
      filtered = [...filtered, mod]
      break
    }
  }
  filtered.sort((a, b) => new Date(a.created) - new Date(b.created))

  let mods = await Promise.all(filtered.map(async mod => {
    let { name, version, author: authorID } = mod

    let findAuthor = await Account.findById(authorID).exec()
    let author = findAuthor ? findAuthor.username : ''

    return { name, version, author }
  }))

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
