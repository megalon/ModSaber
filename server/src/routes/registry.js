const { Router } = require('express')
const semver = require('semver')
const Mod = require('../models/mod.js')
const Account = require('../models/account.js')
const { REDIS_HOST } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

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

router.get('/', cache.route(10), async (req, res) => {
  let mods = await Mod.find({}).exec()
  res.send(mapMods(mods))
})

router.get('/approved', cache.route(10), async (req, res) => {
  let mods = await Mod.find({ approved: true }).exec()
  res.send(mapMods(mods))
})

router.get('/:name', async (req, res) => {
  let { name } = req.params
  let mods = await Mod.find({ name }).exec()
  if (mods.length === 0) return res.sendStatus(404)
  let [latest] = mods.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0 || semver.rcompare(a.version, b.version))

  res.redirect(`/registry/${name}/${latest.version}`)
})

router.get('/:name/:version', cache.route(5 * 60), async (req, res) => {
  let { name: n, version: v } = req.params
  let mod = await Mod.findOne({ name: n, version: v }).exec()

  if (!mod) return res.sendStatus(404)
  let { name, version, author: authorID, title, description, gameVersion, oldVersions, dependsOn, files } = mod

  // Insert file URLs to file object
  let { protocol, headers: { host } } = req
  let baseURL = `${protocol}://${host}/cdn`
  for (let x of Object.entries(files)) {
    let [key, value] = x
    value.url = `${baseURL}/${name}/${version}-${key}.zip`
  }

  try {
    // Lookup author username from DB
    let author = (await Account.findById(authorID).exec()).username
    res.send({ name, version, author, authorID, title, description, gameVersion, oldVersions, dependsOn, files })
  } catch (err) {
    // Send default values
    res.send({ name, version, author: '', authorID: 0, title, description, gameVersion, oldVersions, dependsOn, files })
  }
})

module.exports = router
