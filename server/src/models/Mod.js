const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const { Schema } = mongoose

const Mod = new Schema({
  created: { type: Date, required: true },
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
  description: { type: String, default: '', maxlength: 10000 },
  approved: { type: Boolean, default: false },
  unpublished: { type: Boolean, default: false },
  type: { type: String, enum: ['mod', 'avatar', 'saber', 'platform', 'other'], default: 'mod' },
  category: { type: String, default: '', maxlength: 25 },
  version: String,
  oldVersions: [String],
  gameVersion: Schema.Types.ObjectId,
  files: Schema.Types.Mixed,
  dependsOn: [String],
  conflictsWith: [String],
  weight: { type: Number, default: 1 },
})

Mod.plugin(mongoosePaginate)

module.exports = mongoose.model('Mod', Mod)
