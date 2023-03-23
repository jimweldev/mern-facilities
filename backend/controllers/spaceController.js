const mongoose = require('mongoose')

const Office = require('../models/officeModel')
const Floor = require('../models/floorModel')
const Room = require('../models/roomModel')
const Space = require('../models/spaceModel')

// get all rooms by office slug and floor slug
const getSpacesByOfficeSlugAndFloorSlugAndRoomSlug = async (req, res) => {
  const { officeSlug, floorSlug, roomSlug } = req.params

  const office = await Office.findOne({ slug: officeSlug })
  const floor = await Floor.findOne({ officeId: office._id, slug: floorSlug })
  const room = await Room.findOne({ floorId: floor._id, slug: roomSlug })

  const spaces = await Space.find({ roomId: room._id })

  res.status(200).json({
    office,
    floor,
    room,
    spaces,
  })
}

// fill space row
const fillSpaceRow = async (req, res) => {
  const { spaceId, lastSeatNumber } = req.body

  const space = await Space.findById(spaceId)

  const roomId = space.roomId
  const spaceType = space.spaceType
  const rowNumber = space.rowNumber
  const width = space.width
  const height = space.height
  let x = space.x
  const y = space.y

  const widthInNumber = Number(width.slice(0, -2))

  try {
    for (
      let seatNumber = space.seatNumber + 1;
      seatNumber <= lastSeatNumber;
      seatNumber++
    ) {
      x = x + widthInNumber + 10

      await Space.create({
        roomId,
        spaceType,
        rowNumber,
        seatNumber,
        width,
        height,
        x,
        y,
      })
    }

    const spaces = await Space.find({ roomId })
    res.status(201).json(spaces)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// get all
const getSpaces = async (req, res) => {
  let page = req.query.page || 1
  let limit = req.query.limit || 0
  let search = req.query.search || ''

  let query

  const reqQuery = { ...req.query }

  const removeFields = ['search', 'page', 'limit', 'sort']
  removeFields.forEach((val) => delete reqQuery[val])

  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  query = Space.find(JSON.parse(queryStr))

  // search
  if (req.query.search) {
    query = query.find({
      $or: [
        {
          emailAddress: { $regex: search, $options: 'i' },
        },
        {
          password: { $regex: search, $options: 'i' },
        },
      ],
    })
  }

  // limit
  if (req.query.limit) {
    query = query.limit(limit)
  }

  // pagination
  if (req.query.page) {
    query = query.skip((page - 1) * limit)
  }

  // sort
  if (req.query.sort) {
    const sortByArr = req.query.sort.split(',')

    const sortByStr = sortByArr.join(' ')

    query = query.sort(sortByStr)
  } else {
    query = query.sort('createdAt')
  }

  const spaces = await query

  let count = await Space.find({
    $or: [
      {
        emailAddress: { $regex: search, $options: 'i' },
      },
      {
        password: { $regex: search, $options: 'i' },
      },
    ],
  }).countDocuments({})
  let pages = limit > 0 ? Math.ceil(count / limit) : 1

  res.status(200).json({
    info: {
      count,
      pages,
    },
    records: spaces,
  })
}

// get one
const getSpace = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  const space = await Space.findById(id)

  if (!space) {
    return res.status(400).json({ error: 'No item found' })
  }

  res.status(200).json(space)
}

// create one
const createSpace = async (req, res) => {
  const { roomId, spaceType, label, rowNumber, seatNumber } = req.body

  const x = 0
  const y = 0
  const width = '100px'
  const height = '100px'

  if (!roomId) {
    return res.status(400).json({ error: 'Room ID is required' })
  }

  if (!spaceType) {
    return res.status(400).json({ error: 'Space Type is required' })
  }

  try {
    const space = await Space.create({
      roomId,
      spaceType,
      label,
      rowNumber,
      seatNumber,
      width,
      height,
      x,
      y,
    })

    res.status(201).json(space)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// update one
const updateSpace = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const space = await Space.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        new: true,
      }
    )

    if (!space) {
      res.status(400).json({ error: 'Space not found' })
    }

    res.status(200).json(space)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete one
const deleteSpace = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const space = await Space.findByIdAndDelete({ _id: id })

    if (!space) {
      res.status(400).json({ error: 'Space not found' })
    }

    res.status(200).json(space)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getSpacesByOfficeSlugAndFloorSlugAndRoomSlug,
  fillSpaceRow,
  getSpaces,
  getSpace,
  createSpace,
  updateSpace,
  deleteSpace,
}
