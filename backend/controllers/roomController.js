const mongoose = require('mongoose')

const Office = require('../models/officeModel')
const Floor = require('../models/floorModel')
const Room = require('../models/roomModel')

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// get all rooms by office slug and floor slug
const getRoomsByOfficeSlugAndFloorSlug = async (req, res) => {
  const { officeSlug, floorSlug } = req.params

  const office = await Office.findOne({ slug: officeSlug })
  const floor = await Floor.findOne({ officeId: office._id, slug: floorSlug })

  const rooms = await Room.find({ floorId: floor._id })

  res.status(200).json({
    office,
    floor,
    rooms,
  })
}

// get all
const getRooms = async (req, res) => {
  let page = req.query.page || 1
  let limit = req.query.limit || 0
  let search = req.query.search || ''

  let query

  const reqQuery = { ...req.query }

  const removeFields = ['search', 'page', 'limit', 'sort']
  removeFields.forEach((val) => delete reqQuery[val])

  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  query = Room.find(JSON.parse(queryStr))

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

  const rooms = await query

  let count = await Room.find({
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
    records: rooms,
  })
}

// get one
const getRoom = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  const room = await Room.findById(id)

  if (!room) {
    return res.status(400).json({ error: 'No item found' })
  }

  res.status(200).json(room)
}

// create one
const createRoom = async (req, res) => {
  const { floorId, label, width, height, x, y } = req.body

  if (!floorId) {
    return res.status(400).json({ error: 'Floor ID is required' })
  }

  if (!label) {
    return res.status(400).json({ error: 'label is required' })
  }

  if (width == null) {
    return res.status(400).json({ error: 'Width is required' })
  }

  if (height == null) {
    return res.status(400).json({ error: 'Height is required' })
  }

  if (x == null) {
    return res.status(400).json({ error: 'X is required' })
  }

  if (y == null) {
    return res.status(400).json({ error: 'Y is required' })
  }

  const slug = slugify(label)

  try {
    const room = await Room.create({
      floorId,
      label,
      slug,
      width,
      height,
      x,
      y,
    })

    res.status(201).json(room)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// update one
const updateRoom = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const room = await Room.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        new: true,
      }
    )

    if (!room) {
      res.status(400).json({ error: 'Room not found' })
    }

    res.status(200).json(room)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete one
const deleteRoom = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const room = await Room.findByIdAndDelete({ _id: id })

    if (!room) {
      res.status(400).json({ error: 'Room not found' })
    }

    res.status(200).json(room)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getRoomsByOfficeSlugAndFloorSlug,
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
}
