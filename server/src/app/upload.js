const crypto = require('crypto')
const path = require('path')
const AdmZip = require('adm-zip')
const { errors, BLOCKED_EXTENSIONS } = require('../constants.js')

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
  for (let file of files) {
    const key = file.path.replace(/\./g, '\\u002e')
    final[key] = file.hash
  }
  return final
}

/**
 * @param {string} field File field name
 * @param {string} error Error Code
 */
function ZipException (field, error) { // eslint-disable-line
  this.field = field
  this.error = error
}

/**
 * Calculate the SHA-1 Hash of a File Buffer
 * @param {Buffer} data File Buffer
 * @param {string} field File field name
 * @returns {Promise.<FileInfo[]>}
 */
const processZIP = async (data, field) => {
  let zip = new AdmZip(data)
  let entries = zip.getEntries()
    .map(entry => new Promise(resolve => {
      entry.getDataAsync(async buffer => {
        let hash = await calculateHash(buffer)
        resolve({ path: entry.entryName, hash, isDir: entry.isDirectory })
      })
    }))

  let filesArr = (await Promise.all(entries)).filter(x => !x.isDir)
  if (filesArr.length === 0) throw new ZipException(field, errors.FILE_BLANK)

  for (let file of filesArr) {
    let { ext } = path.parse(file.path)
    if (BLOCKED_EXTENSIONS.includes(ext)) throw new ZipException(field, errors.FILE_CONTAINS_BLOCKED)
  }

  let files = mapFileStructure(filesArr)
  let hash = await calculateHash(data)
  return { hash, files }
}

module.exports = { calculateHash, processZIP }
