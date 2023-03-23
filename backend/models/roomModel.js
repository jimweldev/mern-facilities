const mongoose = require('mongoose')

const Schema = mongoose.Schema

const roomSchema = new Schema(
  {
    floorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Floor',
    },
    // officeTypeId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'OfficeType',
    // },
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
    width: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Room', roomSchema)
