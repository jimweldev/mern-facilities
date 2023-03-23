const mongoose = require('mongoose')

const Schema = mongoose.Schema

const officeSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Office', officeSchema)
