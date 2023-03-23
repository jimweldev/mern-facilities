const mongoose = require('mongoose')

const Schema = mongoose.Schema

const spaceTypeSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('SpaceType', spaceTypeSchema)
