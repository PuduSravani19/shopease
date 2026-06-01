import express from 'express'
import { createOrder, getMyOrders, getOrderById,} from '../controllers/orderController'
import {protect} from '../middleware/authMiddleware'
const router = express.Router()
router.post('/',protect,createOrder)
router.get('/my',protect, getMyOrders)
router.get('/:id',protect,getOrderById)
export default router