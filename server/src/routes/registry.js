const { Router } = require('express')
const semver = require('semver')
const Mod = require('../models/mod.js')

// Setup Router
const router = Router() // eslint-disable-line

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

router.get('/', async (req, res) => {
  let mods = await Mod.find({}).exec()
  res.send(mapMods(mods))
})

router.get('/approved', async (req, res) => {
  let mods = await Mod.find({ approved: true }).exec()
  res.send(mapMods(mods))
})

module.exports = router
