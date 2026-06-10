import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice'
import Navbar from '../components/Navbar'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector(state => state.cart)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleQuantity = (id, qty) => {
    if (qty < 1) {
      dispatch(removeFromCart(id))
    } else {
      dispatch(updateQuantity({ id, quantity: qty }))
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span className="text-6xl">🛒</span>
          <p className="text-gray-400 text-lg">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Your Cart
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
        </h1>

        <div className="flex flex-col gap-4">

          {/* Cart items */}
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center"
              >
                {/* image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded-xl bg-gray-50 p-2"
                  onError={(e) => e.target.src = 'https://placehold.co/400x400?text=No+Image'}
                />

                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                  <p className="text-sm font-bold text-blue-600 mt-1">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* delete */}
                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-gray-300 hover:text-red-400 transition-colors text-xl ml-2"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Proceed to Checkout →
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full mt-2 text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}