const mongoose = require('mongoose')

const Floor = require('../models/floorModel')
const Office = require('../models/officeModel')

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// get all
const getFloors = async (req, res) => {
  let page = req.query.page || 1
  let limit = req.query.limit || 0
  let search = req.query.search || ''

  let query

  const reqQuery = { ...req.query }

  const removeFields = ['search', 'page', 'limit', 'sort']
  removeFields.forEach((val) => delete reqQuery[val])

  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  query = Floor.find(JSON.parse(queryStr))

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

  const floors = await query

  let count = await Floor.find({
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
    records: floors,
  })
}

// get one
const getFloor = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  const floor = await Floor.findById(id)

  if (!floor) {
    return res.status(400).json({ error: 'No item found' })
  }

  res.status(200).json(floor)
}

// create one
const createFloor = async (req, res) => {
  const { officeId, label, number } = req.body

  if (!officeId) {
    return res.status(400).json({ error: 'Office ID is required' })
  }

  if (!label) {
    return res.status(400).json({ error: 'Label is required' })
  }

  if (!number) {
    return res.status(400).json({ error: 'Number is required' })
  }

  const isFloorExisting = await Floor.findOne({ officeId, label })

  if (isFloorExisting) {
    return res.status(400).json({ error: 'Floor is already existing' })
  }

  const slug = slugify(label)

  try {
    const floor = await Floor.create({ officeId, label, slug, number })

    res.status(201).json(floor)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// update one
const updateFloor = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const floor = await Floor.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        new: true,
      }
    )

    if (!floor) {
      res.status(400).json({ error: 'Floor not found' })
    }

    res.status(200).json(floor)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete one
const deleteFloor = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const floor = await Floor.findByIdAndDelete({ _id: id })

    if (!floor) {
      res.status(400).json({ error: 'Floor not found' })
    }

    res.status(200).json(floor)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getFloors,
  getFloor,
  createFloor,
  updateFloor,
  deleteFloor,
}
