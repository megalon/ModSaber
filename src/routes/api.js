const { Router } = require('express')
const fileUpload = require('express-fileupload')
const semver = require('semver')
const { processZIP } = require('../app/api.js')
const Mod = require('../models/mod.js')

// Setup Router
const router = Router() // eslint-disable-line
router.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true }))

router.post('/upload', async (req, res) => {
  let { name, version, title, description, gameVersion, dependsOn } = req.body
  let { steam, oculus } = req.files

  // Validate Required Fields
  if (!name) return res.status(400).send({ field: 'name' })
  if (!version) return res.status(400).send({ field: 'version' })
  if (!title) return res.status(400).send({ field: 'title' })
  if (!gameVersion) return res.status(400).send({ field: 'gameVersion' })

  // Validate SemVer
  version = semver.valid(semver.coerce(version))
  if (version === null) return res.status(400).send({ field: 'version' })

  // Default values
  if (!description) description = ''
  dependsOn = !dependsOn ? [] : dependsOn.split(',')

  // Process Uploaded Files
  if (!steam) return res.status(400).send({ field: 'steam' })
  steam = await processZIP(steam.data)
  oculus = !oculus ? undefined : await processZIP(oculus.data)

  let existing = (await Mod.find({ name }).exec())
    .sort((b, a) => semver.gt(a.version, b.version) ? 1 : semver.gt(b.version, a.version) ? -1 : 0)
  if (existing.length > 0) {
    let [previous] = existing
    // Check they own the mod
    if (!previous.author.id.equals(req.user._id.id)) return res.sendStatus(401)

    // Check SemVer is newer
    if (!semver.gt(version, previous.version)) return res.status(403).send({ error: 'semver' })
  }

  await Mod.create({
    name,
    title,
    author: req.user.id,
    description,
    version,
    oldVersions: [],
    gameVersion,
    files: { steam, oculus },
    dependsOn,
  })

  res.send({ name, steam })
})

module.exports = router
