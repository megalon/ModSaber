const { Router } = require('express')
const { errors } = require('../constants.js')
const log = require('../app/logger.js')
const Account = require('../models/account.js')
const { requireLogin, requireAdmin } = require('../middleware/authorization.js')

// Environment Variables
const { ADMIN_USERNAME } = process.env

// Setup Router
const router = Router() // eslint-disable-line

router.get('/self', requireLogin, (req, res) => {
  let { id, username, verified, admin } = req.user
  res.send({ id, username, verified, admin })
})

router.get('/admins', requireLogin, requireAdmin, async (req, res) => {
  // Fetch all admins
  let admins = await Account.find({ admin: true }).exec()

  // Add global admin to the mix
  if (ADMIN_USERNAME) {
    let user = await Account.findOne({ username: ADMIN_USERNAME }).exec()
    user.admin = true
    if (user) admins = [...admins, user]
  }

  res.send(
    admins.map(x => {
      let { username, _id } = x
      return { id: _id, username }
    })
  )
})

router.post('/admins', requireLogin, requireAdmin, async (req, res) => {
  let { username, action } = req.body

  // Validate Required Fields
  if (!username) return res.status(400).send({ field: 'username', error: errors.MISSING })
  if (!action) return res.status(400).send({ field: 'action', error: errors.MISSING })
  if (!['promote', 'demote'].includes(action)) return res.status(400).send({ field: 'action', error: errors.ACTION_INVALID })

  let user = await Account.findOne({ username }).exec()
  if (!user) return res.sendStatus(404)

  let admin = action === 'promote'
  await user.set({ admin }).save()

  log.info(`Admin status modified - User: ${username} // Action - ${action} [${req.user.username}]`)
  res.sendStatus(200)
})

module.exports = router
