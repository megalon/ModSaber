const mongoose = require('mongoose')
const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const Account = new Schema({
  username: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^[a-z0-9\-_]+$/, 'is invalid'],
    maxlength: 20,
    index: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  password: String,
  resetToken: String,
  verified: { type: Boolean, default: false },
  verifyToken: String,
  changed: { type: Date, required: true },
  admin: { type: Boolean, default: false },
})

Account.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', Account)
