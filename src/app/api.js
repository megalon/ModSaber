const crypto = require('crypto')
const AdmZip = require('adm-zip')

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
  let files = zip.getEntries()
    .map(entry => new Promise(resolve => {
      entry.getDataAsync(async buffer => {
        let hash = await calculateHash(buffer)
        resolve({ path: entry.entryName, hash })
      })
    }))

  return mapFileStructure(await Promise.all(files))
}

module.exports = { calculateHash, processZIP }
