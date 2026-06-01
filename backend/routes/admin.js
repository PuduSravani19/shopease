
import express from 'express'
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { getAllOrders, updateOrderStatus,} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()
// product routes
router.post('/products', protect, adminOnly, createProduct)
router.put('/products/:id', protect, adminOnly, updateProduct)
router.delete('/products/:id', protect, adminOnly, deleteProduct)

// order routes
router.get('/orders', protect, adminOnly, getAllOrders)
router.put('/orders/:id', protect, adminOnly, updateOrderStatus)

export default router   