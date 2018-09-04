const semver = require('semver')
const Account = require('../models/account.js')
const Mod = require('../models/mod.js')
const GameVersion = require('../models/gameversion.js')

/**
 * @typedef {Object} Mod
 * @property {string} name
 * @property {string} version
 * @property {boolean} approved
 * @property {string} author
 * @property {string} authorID
 * @property {string} title
 * @property {string} description
 * @property {string} type
 * @property {string} category
 * @property {string} gameVersion
 * @property {string} gameVersionID
 * @property {string[]} oldVersions
 * @property {string[]} dependsOn
 * @property {string[]} conflictsWith
 * @property {any} files
 */

/**
 * @param {*} mod Mod Object
 * @param {Request} req HTTP Request
 * @returns {Promise.<Mod>}
 */
const mapMod = async (mod, req) => {
  let { name, version, author: authorID, approved, title, description, type, category, created,
    gameVersion: gameVersionID, oldVersions, dependsOn, conflictsWith, files, weight } = mod

  // Insert file URLs to file object
  let { protocol, headers: { host } } = req
  let baseURL = `${protocol}://${host}/cdn`

  let entries = Object.entries(files)
  for (let x of entries) {
    let [key, value] = x
    value.url = `${baseURL}/${name}/${name}-${version}${entries.length === 1 ? '' : `-${key}`}.zip`
  }

  // Lookup Game Version
  let gameVersion = (await GameVersion.findById(gameVersionID).exec()).value

  // Construct return object
  let final = { name, version, approved, title, description, type, category, published: created,
    gameVersion, gameVersionID, oldVersions, dependsOn, conflictsWith, files, weight }

  try {
    // Lookup author username from DB
    let author = (await Account.findById(authorID).exec()).username
    final.author = author
    final.authorID = authorID

    return final
  } catch (err) {
    // Send default values
    final.author = ''
    final.authorID = '0'

    return final
  }
}

/**
 * @typedef {Object} ModShort
 * @property {string} name
 * @property {string[]} versions
 */

/**
 * @param {any} mods Mods Model
 * @returns {Promise.<ModShort[]>}
 */
const mapModsSlim = async mods => {
  let final = []

  for (let mod of mods) {
    let found = final.find(x => x.name === mod.name)
    if (!found) {
      // Create new entry in the array
      final = [...final, {
        name: mod.name,
        title: mod.title,
        author: mod.author,
        type: mod.type,
        created: new Date(mod.created),
        versions: [mod.version],
        weight: mod.weight,
      }]
    } else {
      // Edit the existing entry
      found.versions = [...found.versions, mod.version]
        .sort(semver.rcompare)
      if (found.versions[0] === mod.version) {
        found.author = mod.author
        found.created = new Date(mod.created)
        found.weight = mod.weight
      }
    }
  }

  const mapped = await Promise.all(
    final
      .sort((a, b) => b.created - a.created)
      .map(async mod => {
        let author = await Account.findById(mod.author)
        mod.author = author ? author.username : ''
        mod.created = undefined
        return mod
      })
  )

  return mapped.sort((a, b) => b.weight - a.weight !== 0 ?
    b.weight - a.weight :
    a.name > b.name ?
      1 :
      b.name > a.name ?
        -1 :
        0)
    .map(mod => {
      mod.weight = undefined
      return mod
    })
}

const getPendingMods = async () => {
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

  return Promise.all(filtered.map(async mod => {
    let { name, version, author: authorID } = mod

    let findAuthor = await Account.findById(authorID).exec()
    let author = findAuthor ? findAuthor.username : ''

    return { name, version, author }
  }))
}

module.exports = { mapMod, mapModsSlim, getPendingMods }
