module.exports = {
  MONGO_URL: process.env.NODE_ENV === 'development' ? 'mongodb://localhost/modsaber' : 'mongodb://mongo/modsaber',
  COOKIE_NAME: 'jwt',
}
