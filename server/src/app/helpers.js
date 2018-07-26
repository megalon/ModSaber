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

module.exports = { cookieExtractor, plusDays }
