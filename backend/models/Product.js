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
    category:{
        type:String,
        required:[true, 'Product category is required'],
        enum:['Electonics','Clothing','Books','Sports','Home','Other']
    },
    image:{
        type:String,
        default:'https://via.placeholder.com/400',
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