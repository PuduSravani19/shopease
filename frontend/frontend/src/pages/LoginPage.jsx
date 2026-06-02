import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate , Link} from 'react-router-dom'
import {loginUser, clearError} from '../features/auth/authSlice'
export default function LoginPage(){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {loading, error, token}=useSelector(state =>state.auth)
    const [form, setForm] = useState({email:'', password:''})
    useEffect(()=>{
        if(token) navigate('/')
    },[token, navigate])
 const handleChange =(e)=>{
    setForm({ ...form,[e.targte.name]:e.target.value})
    dispatch(clearError())
 }
 const handleSubmit =(e)=>{
    e.preventDefault()
    dispatch(loginUser(form))
 }
 return(
    <div className="min-h-screen bg-gray-50 flex items-center just-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900"> 🛍️ ShopEase</h1>
                <p className="text-gray-400 text-sm mt-1"> Welcome back!</p>
            </div>
            {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4">
                    {error}
                </div>
            )}
            <form onSubmit ={handleSubmit} className="flex flex-col gap-4" >
                
            <div>
                <label  className="text-sm text-gray-600 mb-1 block"> Email</label>
                <input name="email" type="email" value ={form.email} onChange ={handleChange} placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-blue-100" />

            </div>
            <div>
                <label className="text-sm text-gray-600 mb-1 block">Password</label>
                <input type="password" name="password"  value={form.password} onChange={handleChange} placeholder="••••••" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-100" />
            </div>
            <button type="submit" disabled={loading} className ="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl py-2.5 text-sm font-medium transition-colors mt-2">
                {loading ? 'Logging in ...':'Login'}
            </button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-6">
                No account? {''}
                <Link to ="/register" className='text-blue-500 hover:underline'>Register here</Link>
            </p>
        </div>

    </div>
 )
}