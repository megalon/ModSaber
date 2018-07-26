const { Router } = require('express')

// Setup Router
const router = Router() // eslint-disable-line

router.get('/', (req, res) => {
  res.sendStatus(200)
})

module.exports = router
