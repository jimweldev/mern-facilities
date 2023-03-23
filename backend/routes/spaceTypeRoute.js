const express = require('express')

const {
  getSpaceTypes,
  getSpaceType,
  createSpaceType,
  updateSpaceType,
  deleteSpaceType,
} = require('../controllers/spaceTypeController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getSpaceTypes)
router.get('/:id', authMiddleware, getSpaceType)
router.post('/', authMiddleware, createSpaceType)
router.patch('/:id', authMiddleware, updateSpaceType)
router.delete('/:id', authMiddleware, deleteSpaceType)

module.exports = router
