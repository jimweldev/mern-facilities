const express = require('express')

const {
  getSpacesByOfficeSlugAndFloorSlugAndRoomSlug,
  fillSpaceRow,
  getSpaces,
  getSpace,
  createSpace,
  updateSpace,
  deleteSpace,
} = require('../controllers/spaceController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get(
  '/office-slug/:officeSlug/floor-slug/:floorSlug/room-slug/:roomSlug',
  authMiddleware,
  getSpacesByOfficeSlugAndFloorSlugAndRoomSlug
)
router.post('/fill-space-row', authMiddleware, fillSpaceRow)
router.get('/', authMiddleware, getSpaces)
router.get('/:id', authMiddleware, getSpace)
router.post('/', authMiddleware, createSpace)
router.patch('/:id', authMiddleware, updateSpace)
router.delete('/:id', authMiddleware, deleteSpace)

module.exports = router
