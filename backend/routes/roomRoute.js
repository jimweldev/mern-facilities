const express = require('express')

const {
  getRoomsByOfficeSlugAndFloorSlug,
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get(
  '/office-slug/:officeSlug/floor-slug/:floorSlug',
  authMiddleware,
  getRoomsByOfficeSlugAndFloorSlug
)
router.get('/', authMiddleware, getRooms)
router.get('/:id', authMiddleware, getRoom)
router.post('/', authMiddleware, createRoom)
router.patch('/:id', authMiddleware, updateRoom)
router.delete('/:id', authMiddleware, deleteRoom)

module.exports = router
