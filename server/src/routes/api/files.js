const path = require('path')
const fs = require('fs-extra')
const { Router } = require('express')
const fileUpload = require('express-fileupload')
const fileType = require('file-type')
const semver = require('semver')
const slugify = require('slugify')
const { errors, STORE_PATH } = require('../../constants.js')
const { processZIP } = require('../../app/api.js')
const Account = require('../../models/account.js')
const Mod = require('../../models/mod.js')
const GameVersion = require('../../models/gameversion.js')
const log = require('../../app/logger.js')

// Setup Router
const router = Router() // eslint-disable-line
router.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, abortOnLimit: true }))

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

  let steamType = fileType(steam.data)
  if (steamType.mime !== 'application/zip') return res.status(400).send({ field: 'steam', error: errors.FILE_WRONG_TYPE, mime: steamType.mime })

  if (oculus) {
    let oculusType = fileType(oculus.data)
    if (oculusType.mime !== 'application/zip') return res.status(400).send({ field: 'oculus', error: errors.FILE_WRONG_TYPE, mime: oculusType.mime })
  }

  let steamFiles, oculusFiles
  try {
    // Process Uploaded Files
    steamFiles = await processZIP(steam.data, 'steam')
    oculusFiles = !oculus ? undefined : await processZIP(oculus.data, 'oculus')
  } catch (err) {
    // File contains errors
    return res.status(400).send(err)
  }

  let existing = (await Mod.find({ name }).exec())
    .sort((a, b) => semver.rcompare(a.version, b.version))

  let approved = false
  let weight = 1

  if (existing.length > 0) {
    let [previous] = existing
    // Check they own the mod
    if (!previous.author.id.equals(req.user._id.id)) return res.sendStatus(401)

    // Check SemVer is newer
    if (!semver.gt(version, previous.version)) return res.status(403).send({ error: 'semver', version: previous.version })

    // Keep Mod Weight
    if (previous.weight) weight = previous.weight

    // Lookup game version
    try {
      gameVersion = (await GameVersion.findById(gameVersion).exec())._id
    } catch (err) {
      return res.status(400).send({ field: 'gameVersion', error: errors.GAMEVERSION_INVALID })
    }
  }

  // Pull a list of all old versions
  let oldVersions = existing.map(x => x.version)

  // Created at now
  let created = new Date()

  try {
    await fs.ensureDir(path.join(STORE_PATH, name))
    await fs.writeFile(path.join(STORE_PATH, name, `${version}-${oculus ? 'steam' : 'default'}.zip`), steam.data)
    if (oculus) await fs.writeFile(path.join(STORE_PATH, name, `${version}-oculus.zip`), oculus.data)

    await Mod.create({
      name,
      title,
      author: req.user.id,
      description,
      version,
      oldVersions,
      gameVersion,
      approved,
      weight,
      created,
      files: { steam: steamFiles, oculus: oculusFiles },
      dependsOn,
      conflictsWith,
    })

    log.info(`Mod uploaded - ${name}@${version} [${req.user.username}]`)
    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

router.post('/edit', async (req, res) => {
  let { name, version, title, description } = req.body

  // Validate Required Fields
  if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
  if (!version) return res.status(400).send({ field: 'version', error: errors.MISSING })
  if (!title) return res.status(400).send({ field: 'title', error: errors.MISSING })
  if (!description) return res.status(400).send({ field: 'description', error: errors.MISSING })

  let mod = await Mod.findOne({ name, version }).exec()
  if (!mod) return res.sendStatus(404)

  // Only author and admins can unpublish
  if (!((mod.author.id.equals(req.user._id.id) || req.user.admin))) return res.sendStatus(401)

  await mod.set({ title, description }).save()

  log.info(`Mod edited - ${name}@${version} [${req.user.username}]`)
  res.sendStatus(200)
})

router.post('/transfer', async (req, res) => {
  let { name, username } = req.body

  // Validate Required Fields
  if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
  if (!username) return res.status(400).send({ field: 'username', error: errors.MISSING })

  let [mod] = (await Mod.find({ name, unpublished: false }).exec())
    .sort((a, b) => semver.rcompare(a.version, b.version))

  if (!mod) return res.sendStatus(404)

  // Only author and admins can unpublish
  if (!((mod.author.id.equals(req.user._id.id) || req.user.admin))) return res.sendStatus(401)

  let newOwner = await Account.findOne({ username }).exec()
  if (!newOwner) return res.sendStatus(403)

  await mod.set({ author: newOwner._id }).save()

  log.info(`Mod transferred - Mod: ${name} to ${username} [${req.user.username}]`)
  res.sendStatus(200)
})

router.post('/unpublish', async (req, res) => {
  let { name, version } = req.body

  // Validate Required Fields
  if (!name) return res.status(400).send({ field: 'name', error: errors.MISSING })
  if (!version) return res.status(400).send({ field: 'version', error: errors.MISSING })

  let mod = await Mod.findOne({ name, version, unpublished: false }).exec()
  if (!mod) return res.sendStatus(404)

  // Only author and admins can unpublish
  if (!((mod.author.id.equals(req.user._id.id) || req.user.admin))) return res.sendStatus(401)

  await mod.set({ unpublished: true }).save()

  log.info(`Mod unpublished - ${name}@${version} [${req.user.username}]`)
  res.sendStatus(200)
})

module.exports = router
