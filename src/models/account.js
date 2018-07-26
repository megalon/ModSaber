const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const Account = new Schema({
  username: String,
  email: { type: String, lowercase: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  password: String,
  active: { type: Boolean, default: false },
})

Account.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', Account)
