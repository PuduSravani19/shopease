import mongoose from 'mongoose'
 const orderItemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name:{ 
        type:String,
        required:true
    },
    image: {
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        default:1

    },
})
    const deliveryAddressSchema = new mongoose.Schema({
        fullName :{
            type:String,required:true
        },
        phone:{
            type:String, required:true
        },
        address:{ type: String, required:true},
        city:{ type:String, required:true},
        pincode : {type:String, required:true}
    })
    const orderSchema = new mongoose.Schema({
        user:{
            type:mongoose.Schema.Tyoes.objectId,
            ref:'User',
            required: true,
        },
        items: [orderItemSchema],
        deliveryAddress: deliveryAddressSchema,
        paymentMethod:{
            type:String,
            enum: ['COD', Online],
            default:'COD'
        },
        totalPrice:{
            type:Number,
            required:true,
            default:0,

        },
        status:{
            type:String,
            enum: ['pending','confirmed','shipped','delivered','cancelled'],
            default:'pending'
        },
        isPaid:{
            type:Boolean,
            default:false
        },
        paidAt:{type:Date},
        deliveredAt:{type:Date},
    },{timestamps:true})
    export default mongoose.model('Order',orderSchema)
