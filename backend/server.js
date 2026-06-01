import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import {fileURLToPath} from 'url'
import {dirname , join} from 'path'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname (__filename)

dotenv.config({path:join(__dirname,'.env')})
console.log('MONGO_URI:', process.env.MONGO_URI)
const app = express()
const httpServer = createServer(app)
export const io= new Server(httpServer, {
    cors:{
        origin:'http://localhost:5173',
        methods:['GET','POST']
    }
})
io.on('connection',(socket)=>{
    console.log('Client connected:',socket.id)
    socket.on('disconnect',()=>{
        console.log('Client disconnected:',socket.id)
    })
})

app.use(cors({origin:'http://localhost:5173'}))
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/admin',adminRoutes)
app.get('/',(req,res)=>{
    res.json({message:'ShopEase API is running'})
})
mongoose.connect(process.env.MONGO_URI,{
    serverSelectionTimeoutMS: 10000,
})
.then(()=>{
    console.log('✅ Mongo connected')
    httpServer.listen(process.env.PORT,()=>{
        console.log(`✅ server running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.error('❌ MongoDB connection failed:', err.message)
})
