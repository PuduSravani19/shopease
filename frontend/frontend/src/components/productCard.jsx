import {useDispatch} from 'react-redux'
import { addToCart} from '../features/cart/cartSlice'
export default function ProductCard({product}){
    const dispatch = useDispatch()
    const handleAddToCart=()=>{
        dispatch(addToCart(product))
    }
     return(
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* image */}
            <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                <img className="h-full w-full object-contain" alt={product.name} src={product.image} onError={(e)=>e.target.src='http://via.placeholder.com/400'} />
            </div>
            {/* info */}
            <div className="p-4">
                <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                    {product.category}
                </span>
                <h3 className="text-sm font-semibold text-gray-900 mt-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs text-gray-400">{product.ratings} ({product.numReviews})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-gray-900"> ₹{product.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">{product.stock > 0 ? `${product.stock} left`: 'Out of stock'}</span>
                </div>
                <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm py-2 rounded-xl transition-colors font-medium"
                onClick={handleAddToCart} disabled={product.stock === 0}> {product.stock === 0 ? 'Out of stock': '+Add to cart'}</button>
            </div>
        </div>

     )
} 