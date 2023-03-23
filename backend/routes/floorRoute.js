const express = require('express')

const {
  getFloors,
  getFloor,
  createFloor,
  updateFloor,
  deleteFloor,
} = require('../controllers/floorController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, getFloors)
router.get('/:id', authMiddleware, getFloor)
router.post('/', authMiddleware, createFloor)
router.patch('/:id', authMiddleware, updateFloor)
router.delete('/:id', authMiddleware, deleteFloor)

module.exports = router
