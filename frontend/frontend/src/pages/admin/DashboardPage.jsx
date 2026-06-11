import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import axios from '../../api/axios'
import Navbar from '../../components/Navbar'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ total: 0, revenue: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState('')

  // fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/admin/orders')
      setOrders(data.orders)
      setStats({
        total: data.count,
        revenue: data.totalRevenue,
        pending: data.orders.filter(o => o.status === 'pending').length,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // redirect if not admin
    if (user && user.role !== 'admin') {
      navigate('/')
    }
    fetchOrders()

    // ── Socket.io real-time ──────────────────
    const socket = io('http://localhost:5000')

    socket.on('connect', () => {
      console.log('Admin connected to socket')
    })

    // listen for new orders
    socket.on('newOrder', (data) => {
      setNotification(`🛍️ New order! ₹${data.totalPrice}`)
      fetchOrders() // refresh orders list
      setTimeout(() => setNotification(''), 5000)
    })

    return () => socket.disconnect()
  }, [user])

  // update order status
  const handleStatusUpdate = async (orderId, status) => {
    try {
      await axios.put(`/admin/orders/${orderId}`, { status })
      fetchOrders()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* notification */}
        {notification && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-pulse">
            {notification}
          </div>
        )}

        <h1 className="text-xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{stats.revenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs text-gray-400 mb-1">Pending Orders</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            All Orders
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-400 py-8">No orders yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map(order => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-mono font-medium text-gray-700">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.user?.name} • {order.user?.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.items.length} items •{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{order.totalPrice.toLocaleString()}
                    </p>

                    {/* status dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="confirmed">✅ Confirmed</option>
                      <option value="shipped">🚚 Shipped</option>
                      <option value="delivered">📦 Delivered</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}