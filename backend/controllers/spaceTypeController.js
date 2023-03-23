const mongoose = require('mongoose')

const SpaceType = require('../models/spaceTypeModel')

// get all
const getSpaceTypes = async (req, res) => {
  const spaceTypes = await SpaceType.find()

  res.status(200).json({
    spaceTypes,
  })
}

// get one
const getSpaceType = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  const spaceType = await SpaceType.findById(id)

  if (!spaceType) {
    return res.status(400).json({ error: 'No item found' })
  }

  res.status(200).json(spaceType)
}

// create one
const createSpaceType = async (req, res) => {
  const { label } = req.body

  if (!label) {
    return res.status(400).json({ error: 'label is required' })
  }

  try {
    const spaceType = await SpaceType.create({
      label,
    })

    res.status(201).json(spaceType)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// update one
const updateSpaceType = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const spaceType = await SpaceType.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        new: true,
      }
    )

    if (!spaceType) {
      res.status(400).json({ error: 'Space not found' })
    }

    res.status(200).json(spaceType)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete one
const deleteSpaceType = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No item found' })
  }

  try {
    const spaceType = await SpaceType.findByIdAndDelete({ _id: id })

    if (!spaceType) {
      res.status(400).json({ error: 'Space not found' })
    }

    res.status(200).json(spaceType)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getSpaceTypes,
  getSpaceType,
  createSpaceType,
  updateSpaceType,
  deleteSpaceType,
}
