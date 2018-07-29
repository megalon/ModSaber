const { Router } = require('express')
const { errors } = require('../../constants.js')
const Account = require('../../models/account.js')
const GameVersion = require('../../models/gameversion.js')

// Environment Variables
const { ADMIN_USERNAME } = process.env

// Setup Router
const router = Router() // eslint-disable-line

router.post('/gameversion', async (req, res) => {
  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)

  let { value, manifest, date } = req.body

  // Validate Required Fields
  if (!value) return res.status(400).send({ field: 'value', error: errors.MISSING })
  if (!manifest) return res.status(400).send({ field: 'manifest', error: errors.MISSING })
  if (!date) return res.status(400).send({ field: 'date', error: errors.MISSING })

  try {
    date = new Date(Number.parseInt(date) ? Number.parseInt(date) : date)
    await GameVersion.create({ value, manifest, date })
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
})

router.get('/admins', async (req, res) => {
  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)

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

router.post('/admins/modify', async (req, res) => {
  // Admins Only
  if (!req.user.admin) return res.sendStatus(401)

  let { username, action } = req.body

  // Validate Required Fields
  if (!username) return res.status(400).send({ field: 'username', error: errors.MISSING })
  if (!action) return res.status(400).send({ field: 'action', error: errors.MISSING })
  if (!['promote', 'demote'].includes(action)) return res.status(400).send({ field: 'action', error: errors.ACTION_INVALID })

  let user = await Account.findOne({ username }).exec()
  if (!user) return res.sendStatus(404)

  let admin = action === 'promote'
  await user.set({ admin }).save()

  res.sendStatus(200)
})

module.exports = router