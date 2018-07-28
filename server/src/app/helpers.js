const uuid = require('uuid/v4')

/**
 * Extract JWT from Request Cookies
 * @param {Request} req HTTP Request
 * @returns {string}
 */
const cookieExtractor = req => req && req.cookies ? req.cookies.jwt : null

/**
 * Returns a date n days ahead of today
 * @param {number} days Days to Add
 * @returns {Date}
 */
const plusDays = days => new Date(new Date().setDate(new Date().getDate() + days))

/**
 * Asynchronously Blocks for n milliseconds
 * @param {number} ms n milliseconds
 * @returns {Promise.<void>}
 */
const waitForMS = ms => new Promise(resolve => {
  setTimeout(() => { resolve() }, ms)
})

/**
 * Generate a safe pseudo-random token
 * @returns {string}
 */
const randomToken = () => uuid().replace(/-/g, '')

module.exports = { cookieExtractor, plusDays, waitForMS, randomToken }
