const { Router } = require('express')
const filesRouter = require('./api/files.js')
const adminRouter = require('./api/admin.js')

// Setup Router
const router = Router() // eslint-disable-line

router.get('/self', (req, res) => {
  let { id, username, verified, admin } = req.user
  res.send({ id, username, verified, admin })
})

router.use(filesRouter)
router.use(adminRouter)

module.exports = router
