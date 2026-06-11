import jwt from 'jsonwebtoken'
import User from '../models/User.js'
// - Generate JWT Token -
const generateToken = (userId) => {
    console.log('JWT_SECRET:', process.env.JWT_SECRET)
    return jwt.sign(
        {userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    )
}
 // - Register -
 export const register = async (req , res)=>{
    try{
        console.log("Register body:", req.body);
        const {name, email, password} = req.body
         // check required fields
         if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'})
         }
          // check if user already exists
          const existingUser = await User.findOne({email})
          if(existingUser){
            return res.status(400).json({message: 'Email already registered'})
          } 
          // create user - password gets hashed by pre-save hook
          const user = await User.create({name, email, password})
          const token = generateToken(user._id)
          res.status(201).json({
            message: 'Registration sucessful',
            token,
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            }
          })
          
    } catch (err){
        console.error("register error:", err);
        res.status(500).json({message:err.message})
    }
 }
  // -login -
  export const login = async (req,res)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message:'Email and password are required'})
        }
        // find user
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message:'Invalid email or password'})
        }
         // compare password
         const isMatch = await user.comparePassword(password)
         if(!isMatch){
            return res.status(401).json({message:'Invalid email or password'})
         }
         const token = generateToken(user._id)
         res.json({
            message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
         })
    } catch (err){
        res.status(500).json({message: err.message})
    }
  }
   // - Get current user (protected) -
   export const getMe = async (req,res)=>{
    res.json({
        user:{
            _id:req.user._id,
            name:req.user.name,
            email: req.user.email,
            role: req.user.role,
        }
    })
   }

