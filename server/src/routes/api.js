const path = require('path')
const fs = require('fs-extra')
const { Router } = require('express')
const fileUpload = require('express-fileupload')
const semver = require('semver')
const slugify = require('slugify')
const { errors, STORE_PATH } = require('../constants.js')
const { processZIP } = require('../app/api.js')
const Mod = require('../models/mod.js')

// Setup Router
const router = Router() // eslint-disable-line
router.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true }))

router.get('/self', (req, res) => {
  let { username, verified, admin } = req.user
  res.send({ username, verified, admin })
})

router.post('/upload', async (req, res) => {
  // Refuse unverified accounts
  if (!req.user.verified) return res.status(403).send({ error: 'verification' })

  let { name, version, title, description, gameVersion, dependsOn, conflictsWith } = req.body
  if (!req.files) return res.status(400).send({ field: 'steam' })
  let { steam, oculus } = req.files

  // Validate Required Fields
  if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
  if (!version) return res.status(400).send({ field: 'version', error: errors.MISSING })
  if (!title) return res.status(400).send({ field: 'title', error: errors.MISSING })
  if (!gameVersion) return res.status(400).send({ field: 'gameVersion', error: errors.MISSING })

  // Coerce name correct format
  name = slugify(name, { lower: true })

  // Validate SemVer
  version = semver.valid(semver.coerce(version))
  if (version === null) return res.status(400).send({ field: 'version', error: errors.SEMVER_INVALID })

  // Default values
  if (!description) description = ''
  dependsOn = !dependsOn ? [] : dependsOn.split(',')
  conflictsWith = !conflictsWith ? [] : conflictsWith.split(',')

  // Validate Uploaded Files
  if (!steam) return res.status(400).send({ field: 'steam' })
  if (steam.mimetype !== 'application/zip') return res.status(400).send({ field: 'steam', error: errors.FILE_WRONG_TYPE })
  if (oculus) if (oculus.mimetype !== 'application/zip') return res.status(400).send({ field: 'oculus', error: errors.FILE_WRONG_TYPE })

  // Process Uploaded Files
  let steamFiles = await processZIP(steam.data)
  let oculusFiles = !oculus ? undefined : await processZIP(oculus.data)

  let existing = (await Mod.find({ name }).exec())
    .sort((a, b) => semver.rcompare(a.version, b.version))

  let approved = false
  if (existing.length > 0) {
    let [previous] = existing
    // Check they own the mod
    if (!previous.author.id.equals(req.user._id.id)) return res.sendStatus(401)

    // Check SemVer is newer
    if (!semver.gt(version, previous.version)) return res.status(403).send({ error: 'semver' })

    // Keep approved status
    if (previous.approved) approved = true
  }

  // Pull a list of all old versions
  let oldVersions = existing.map(x => x.version)

  try {
    await fs.ensureDir(path.join(STORE_PATH, name))
    await fs.writeFile(path.join(STORE_PATH, name, `${version}-steam.zip`), steam.data)

    await Mod.create({
      name,
      title,
      author: req.user.id,
      description,
      version,
      oldVersions,
      gameVersion,
      approved,
      files: { steam: steamFiles, oculus: oculusFiles },
      dependsOn,
      conflictsWith,
    })

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

module.exports = router
