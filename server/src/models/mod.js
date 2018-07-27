const mongoose = require('mongoose')
const { Schema } = mongoose

const Mod = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    match: [/^[a-z0-9\-_]+$/, 'is invalid'],
    maxlength: 35,
    index: true,
  },
  title: { type: String, required: [true, "can't be blank"], maxlength: 50 },
  author: Schema.Types.ObjectId,
  description: { type: String, default: '', maxlength: 1000 },
  approved: { type: Boolean, default: false },
  version: String,
  oldVersions: [String],
  gameVersion: String,
  files: Schema.Types.Mixed,
  dependsOn: [String],
  conflictsWith: [String],
})

module.exports = mongoose.model('Mod', Mod)
