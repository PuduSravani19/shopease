import mongoose from 'mongoose'
const reviewSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    name:{type:String, required:true},
    rating: {type: Number, required: true},
    comment:{ type: String, required:true}

}, {timestamps : true})
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Product name is required'],
        trime:true
    },
    description:{
        type:String,
        required:[true, 'Product category is required']
    },
    price:{
        type:Number,
        required: [true, 'Product price is required']

    },
    // ✅ new — remove enum restriction
category: {
  type: String,
  required: [true, 'Product category is required'],
},
    

    image:{
        type:String,
        default: 'https://placehold.co/400x400?text=No+Image',
    },
    stock:{
        type:Number,
    required: true,
    default: 0,
    min: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
}, { timestamps: true })

    
    
export default mongoose.model('Product', productSchema)