const mongoose = require('mongoose')

const Office = require('../models/officeModel')

const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// get by office slug
const getOfficeByOfficeSlug = async (req, res) => {
  const { officeSlug } = req.params

  const office = await Office.findOne({ slug: officeSlug })

  if (!office) {
    return res.status(400).json({ error: 'No item found' })
  }

  res.status(200).json(office)
}

// get all
const getOffices = async (req, res) => {
  let page = req.query.page || 1
  let limit = req.query.limit || 0
  let search = req.query.search || ''

  let query

  const reqQuery = { ...req.query }

  const removeFields = ['search', 'page', 'limit', 'sort']
  removeFields.forEach((val) => delete reqQuery[val])

  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)
  query = Office.find(JSON.parse(queryStr))

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

  const offices = await query

  let count = await Office.find({
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
    records: offices,
  })
}

// get one
const getOffice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  const office = await Office.findById(id)

  if (!office) {
    return res.status(400).json({ error: 'No item found' })
  }

  res.status(200).json(office)
}

// create one
const createOffice = async (req, res) => {
  const { label } = req.body

  if (!label) {
    return res.status(400).json({ error: 'Label is required' })
  }

  const slug = slugify(label)

  try {
    const office = await Office.create({ label, slug })

    res.status(201).json(office)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// update one
const updateOffice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const office = await Office.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        new: true,
      }
    )

    if (!office) {
      res.status(400).json({ error: 'Office not found' })
    }

    res.status(200).json(office)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete one
const deleteOffice = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const office = await Office.findByIdAndDelete({ _id: id })

    if (!office) {
      res.status(400).json({ error: 'Office not found' })
    }

    res.status(200).json(office)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getOfficeByOfficeSlug,
  getOffices,
  getOffice,
  createOffice,
  updateOffice,
  deleteOffice,
}
