const mongoose = require('mongoose')

const Schema = mongoose.Schema

const spaceSchema = new Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Room',
    },
    spaceType: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      trim: true,
    },
    rowNumber: {
      type: Number,
    },
    seatNumber: {
      type: Number,
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

module.exports = mongoose.model('Space', spaceSchema)
