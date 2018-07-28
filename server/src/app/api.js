const crypto = require('crypto')
const AdmZip = require('adm-zip')
const Account = require('../models/account.js')
const GameVersion = require('../models/gameversion.js')

/**
 * Calculate the SHA-1 Hash of a File Buffer
 * @param {Buffer} data File Buffer
 * @returns {Promise.<string>}
 */
const calculateHash = data => new Promise(resolve => {
  let h = crypto.createHash('sha1')
  h.update(data)
  resolve(h.digest('hex'))
})

/**
 * @typedef {Object} FileInfo
 * @property {string} path
 * @property {string} hash
 */

/**
 * @param {FileInfo[]} files File Structure
 * @returns {*}
 */
const mapFileStructure = files => {
  let final = {}
  for (let file of files) { final[file.path] = file.hash }
  return final
}

/**
 * Calculate the SHA-1 Hash of a File Buffer
 * @param {Buffer} data File Buffer
 * @returns {Promise.<FileInfo[]>}
 */
const processZIP = async data => {
  let zip = new AdmZip(data)
  let entries = zip.getEntries()
    .map(entry => new Promise(resolve => {
      entry.getDataAsync(async buffer => {
        let hash = await calculateHash(buffer)
        resolve({ path: entry.entryName, hash })
      })
    }))

  let hash = await calculateHash(data)
  let files = mapFileStructure(await Promise.all(entries))
  return { hash, files }
}

/**
 * @typedef {Object} Mod
 * @property {string} name
 * @property {string} version
 * @property {string} author
 * @property {string} authorID
 * @property {string} title
 * @property {string} description
 * @property {string} tag
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
    return { name, version, author, authorID, title, description,
      tag, gameVersion, gameVersionID, oldVersions, dependsOn, conflictsWith, files }
  } catch (err) {
    // Send default values
    return { name, version, author: '', authorID: '0', title, description,
      tag, gameVersion, gameVersionID, oldVersions, dependsOn, conflictsWith, files }
  }
}

module.exports = { calculateHash, processZIP, mapMod }
