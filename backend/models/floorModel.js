const mongoose = require('mongoose')

const Schema = mongoose.Schema

const floorSchema = new Schema(
  {
    officeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Office',
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Floor', floorSchema)
