const mongoose = require('mongoose')
const { Schema } = mongoose

const GameVersion = new Schema({
  value: { type: String, required: [true, "can't be blank"], unique: true, index: true },
  manifest: { type: String, required: [true, "can't be blank"], unique: true },
  date: { type: Date, required: [true, "can't be blank"] },
})

module.exports = mongoose.model('GameVersion', GameVersion)
