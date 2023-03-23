const express = require('express')

const {
  getOfficeByOfficeSlug,
  getOffices,
  getOffice,
  createOffice,
  updateOffice,
  deleteOffice,
} = require('../controllers/officeController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/office-slug/:officeSlug', authMiddleware, getOfficeByOfficeSlug)
router.get('/', authMiddleware, getOffices)
router.get('/:id', authMiddleware, getOffice)
router.post('/', authMiddleware, createOffice)
router.patch('/:id', authMiddleware, updateOffice)
router.delete('/:id', authMiddleware, deleteOffice)

module.exports = router
