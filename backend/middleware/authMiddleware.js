import JWT from 'jsonwebtoken'
import User from '../models/User.js'

// - protect route - must be logged in -
 export const protect = async (req , res) =>{
    try{
        let token
        if(req.headers.authorization?.startsWith('Bearer')){
            token = req.headers.authorization.split('')[1]
        }
        if(!token){
            return res.status(401).json({message: 'Not authorized, no token'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.userId).select('-password')
        if(!req.user){
            return res.status(401).json({message:'User not found'})

        }
        next()
    } catch {
        res.status(401).json({message:'Not authrorized, invalid token'})
    }
 }
  // -Admin only route -
  export const adminOnly = (req,res,ext) =>{
    if(req.user?.role === 'admin'){
        next()
    } else{
        res.status(403).json({message: 'Admin access required'})
    }
  }