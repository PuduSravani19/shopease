import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from '../api/axios'
import Navbar from '../components/Navbar'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const STATUS_EMOJI = {
  pending: '⏳',
  confirmed: '✅',
  shipped: '🚚',
  delivered: '📦',
  cancelled: '❌',
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/orders/my')
        setOrders(data.orders)
      } catch (err) {
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">My Orders</h1>

        {/* loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {/* error */}
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* empty */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-4">
            <span className="text-5xl">📦</span>
            <p className="text-gray-400">No orders yet</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* orders list */}
        {!loading && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                {/* header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Order ID</p>
                    <p className="text-sm font-mono font-medium text-gray-700">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_EMOJI[order.status]} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* items */}
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {order.items.map((item, i) => (
                    <img
                      key={i}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 shrink-0"
                      onError={(e) => e.target.src = 'https://placehold.co/400x400?text=No+Image'}
                    />
                  ))}
                </div>

                {/* footer */}
                <div className="flex items-center justify-between text-sm border-t border-gray-50 pt-3">
                  <div className="text-gray-400 text-xs">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'} •{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="font-bold text-gray-900">
                    ₹{order.totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
