import mongoose from 'mongoose'
import modMetaTags from '../../src/js/components/layout/ModMetaTags.jsx'

export default async (req, res, next) => {
  const { name, version } = req.params

  try {
    const mods = await mongoose.connection.db.collection('mods')
    const query = version ? { name, version, unpublished: false, approved: true } : { name, unpublished: false, approved: true }
    const [mod] = await (await mods.find(query)).toArray()

    // Ignore for no mod
    if (!mod) return next()

    const accounts = await mongoose.connection.db.collection('accounts')
    const [author] = await (await accounts.find({ _id: mod.author })).toArray()
    console.log(author)

    // Push meta tags to next middleware
    req.metaTags = modMetaTags(mod.name, mod.version, author.username || 'author', mod.title)
    return next()
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
}
