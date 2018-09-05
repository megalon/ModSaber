const devCORS = (req, res, next) => {
  // Ignore if not in dev mode
  if (process.env.NODE_ENV !== 'development') return next()

  const origins = [
    'http://localhost:3000',
    'http://localhost:3002',
  ]

  const i = origins.indexOf(req.headers.origin)
  if (i === -1) return next()

  res.set('Access-Control-Allow-Origin', origins[i])
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.set('Access-Control-Allow-Credentials', 'true')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')

  next()
}

module.exports = devCORS
