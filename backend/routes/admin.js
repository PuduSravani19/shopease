
import express from 'express'
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/products', protect, adminOnly, createProduct)
router.put('/products/:id', protect, adminOnly, updateProduct)
router.delete('/products/:id', protect, adminOnly, deleteProduct)

export default router   