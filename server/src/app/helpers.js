const { post } = require('snekfetch')
const uuid = require('uuid/v4')

// Environment Variables
const { APPROVAL_WEBHOOK } = process.env

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

/**
 * @typedef {Object} Mod
 * @property {string} name Mod Name
 * @property {string} version Mod Version
 * @property {string} title Mod Title
 * @property {string} author Mod Author
 */

/**
 * @param {Mod} mod Mod Details
 * @param {Object} field Field Options
 * @param {string} field.title Field Title
 * @param {string} field.body Field Body
 * @returns {Object}
 */
const generatePayload = (mod, field) => ({
  embeds: [
    {
      author: {
        name: mod.title,
      },
      title: `${mod.name}@${mod.version} // ${mod.author}`,
      url: `https://www.modsaber.ml/mod/${mod.name}/${mod.version}`,
      color: 12822271,
      thumbnail: {
        url: 'https://www.modsaber.ml/favicon.png',
      },
      fields: [
        {
          name: field.title,
          value: field.body,
          inline: true,
        },
      ],
    },
  ],
})

/**
 * @param {Mod} mod Mod Details
 * @param {string} user Invoking User
 * @returns {Object}
 */
const approvedPayload = (mod, user) =>
  generatePayload(mod, { title: '✅ Mod Approved', body: `Approved by \`${user}\`` })

/**
 * @param {Mod} mod Mod Details
 * @param {string} user Invoking User
 * @returns {Object}
 */
const revokedPayload = (mod, user) =>
  generatePayload(mod, { title: '❌ Approval Revoked', body: `Revoked by \`${user}\`` })

// Post Webhook
const postWebhook = payload => {
  if (APPROVAL_WEBHOOK !== undefined && APPROVAL_WEBHOOK !== '') return post(APPROVAL_WEBHOOK, { data: payload })
  else return undefined
}

module.exports = { cookieExtractor, plusDays, waitForMS, randomToken, approvedPayload, revokedPayload, postWebhook }
