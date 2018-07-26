const { Router } = require('express')
const fileUpload = require('express-fileupload')
const { calculateHash, processZIP } = require('../app/api.js')

// Setup Router
const router = Router() // eslint-disable-line
router.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true }))

router.post('/upload', async (req, res) => {
  let { data } = req.files.steam
  let hash = await calculateHash(data)
  let files = await processZIP(data)

  res.send({ hash, files })
})

module.exports = router
