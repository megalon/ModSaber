const { Router } = require('express')
const semver = require('semver')
const Mod = require('../models/mod.js')
const Account = require('../models/account.js')
const GameVersion = require('../models/gameversion.js')
const { REDIS_HOST } = require('../constants.js')

// Setup Router
const router = Router() // eslint-disable-line
const cache = require('express-redis-cache')({ host: REDIS_HOST })

router.get('/:name', async (req, res) => {
  let { name } = req.params
  let mods = await Mod.find({ name }).exec()
  if (mods.length === 0) return res.sendStatus(404)
  let [latest] = mods.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0 || semver.rcompare(a.version, b.version))

  res.redirect(`/registry/${name}/${latest.version}`)
})

router.get('/:name/:version', cache.route({ expire: { 200: 5 * 60, xxx: 1 } }), async (req, res) => {
  let { name: n, version: v } = req.params
  let mod = await Mod.findOne({ name: n, version: v }).exec()

  if (!mod) return res.sendStatus(404)
  let { name, version, author: authorID, title, description, tag, gameVersion: gameVersionID, oldVersions, dependsOn, conflictsWith, files } = mod

  // Insert file URLs to file object
  let { protocol, headers: { host } } = req
  let baseURL = `${protocol}://${host}/cdn`
  for (let x of Object.entries(files)) {
    let [key, value] = x
    value.url = `${baseURL}/${name}/${version}-${key}.zip`
  }

  // Lookup Game Version
  let gameVersion = (await GameVersion.findById(gameVersionID).exec()).value

  try {
    // Lookup author username from DB
    let author = (await Account.findById(authorID).exec()).username
    res.send({ name, version, author, authorID, title, description,
      tag, gameVersion, gameVersionID, oldVersions, dependsOn, conflictsWith, files })
  } catch (err) {
    // Send default values
    res.send({ name, version, author: '', authorID: 0, title, description,
      tag, gameVersion, gameVersionID, oldVersions, dependsOn, conflictsWith, files })
  }
})

module.exports = router
