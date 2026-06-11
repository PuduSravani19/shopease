import express from 'express'
import {register, login, getMe} from '../controllers/authController.js'
import { protect} from '../middleware/authMiddleware.js'
import User from '../models/User.js'
const router = express.Router()
router.post('/register',register)
router.post('/login',login)
router.get('/me',protect, getMe)
router.put('/make-admin/:email', async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.params.email },
    { role: 'admin' },
    { new: true }
  )
  res.json(user)
})
export default router