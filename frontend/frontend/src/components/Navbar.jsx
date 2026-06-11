import { useSelector, useDispatch} from 'react-redux'
import { Link, useNavigate} from 'react-router-dom'
import {logout} from '../features/auth/authSlice'
export default function Navbar(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user} = useSelector(state =>state.auth)
    const { items } = useSelector(state =>state.cart)
     const cartCount = items.reduce((sum, item)=>sum+item.quantity,0)
     const handleLogout=()=>{
        dispatch(logout())
        navigate('/login')
     }
     return(
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold text-gray-900">🛍️ ShopEase</Link>
                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* cart */}
                    <Link to="/cart" className="relative">

                    <span className="text-2xl">🛒</span>
                    {cartCount >0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                            {cartCount}
                        </span>
                    )}
                    </Link>
                    <Link to="/orders" className="text-sm text-gray-600 hover:text-blue-600">
  📦 Orders
</Link>
                    {/* User */}
                    {user  ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                                Hi, {user.name.split('')[0]}!
                            </span>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium"> Admin</Link>
                            )}
                            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-400 transition-colors">Logout</button>
                        </div>
                    ):(
                        <Link to="/login" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl"> Login </Link>
                    )}
                </div>
            </div>
        </nav>
     )
}