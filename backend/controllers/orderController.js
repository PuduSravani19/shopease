import Order from '../models/Order.js'
import Product from '../models/Product.js'
import {io} from '../server.js'
 // - place new order -
 export const createOrder = async (req, res)=>{
    try{
        const {items, deliveryAddress, paymentMethod} = req.body
        if(!items || items.length === 0){
            return res.status(400).json({message:'No items in order'})
        }
         //calculate total price
         const totalPrice = items.reduce((sum, item)=>{
            return sum+ (item.price * item.quantity)
         },0)
         const order = await Order.create({
            user: req.user._id,
            items,
            deliveryAddress,
            paymentMethod,
            totalPrice,
         })
          // update stock for each product
          for(const items of items) {
            await Product.findByIdAndUpdate(item.product,{
                $inc:{stock : -item.quantity}
            })
          }
          // emit real-time event to admin
          io.emit('new order',{
            orderId :order._id,
            totalPrice:order.totalPrice,
            status: order.status,
          })
          res.status(201).json({
            message :'Order placed sucessfully',
            order,
          })
    } catch(err){
        res.status(500).json({message:err.message})
    }
 }
  //- Get my orders -
  export const getMyOrders = async (req, res)=>{
    try{
        const orders = await Order.find({user:req.user._id})
        .populate('items.product', 'name image')
        .sort ({createdAt: -1})
        res.json({count:orders.length , orders})

    } catch(err){
        res.status(500).json({message: err.message})

    }
  } 
  // - Get Single order -
  export const getOrderById = async(req,res)=>{
    try{
        const order = await Order.findById(req.params._id)
        .populate('user','name email')
        .populate('items.product','name image')
        if(!order){
            return res.status(404).json({message:'Order not found'})
        }
         // only owner or admin can view
         if(order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
            return res.status(403).json({message: 'Not authorized'})
         }
         res.json(order)
    } catch(err){
        res.status(500).json({message:err.message})
    }
  } 
  // Get all orders (admin) -
  export const getAllOrders = async (req,res)=>{
     try{
        const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({createdAt: -1})
        const totalRevenue = orders.reduce((sum,order)=>sum + order)
        res.json({
            count: orders.length,
            totalRevenue,
            orders,
        })
     } catch(err){
        res.status(500).json({message:err.message})
     }
  }
   // -Update order status (admin) -
  
   export const updateOrderStatus = async (req, res)=>{
    try{
        const {status} = req.body
        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(404).json({message: 'Order not found'})
        }
        order.status = status
        if(status === 'delivered'){
            order.isPaid = true
            order.paidAt = Date.now()
            order.deliveredAt = Date.now()
        }
        await order.save()
        // emit realtime status update to customer
        io.emit (`orderStatus_${order._id}`,{
            orderId:order._id,
            status: order.status,
        })
        res.json({
            message: 'Order status updated',
            order,
        })
    } catch ( err){
        res.status(500).json({message:err.message})
    }
   }