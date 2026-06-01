import express from 'express'
const router = express.Router()
router.get('/',(res,req)=> res.json({message:'Admin routes working'}))
export default router