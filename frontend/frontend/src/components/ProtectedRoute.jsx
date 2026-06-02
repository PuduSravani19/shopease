import { useSelector} from 'react-redux'
import { Navigate } from 'react-router-dom'
 export default function ProtectedRoute({children,adminOnly = false}){
    const {token, user} = useSelector(state => state.auth)
    if(!token){
        return <Navigate to ="/login" replace />
    }
    if(adminOnly && user?.role !== 'admin'){
        return <Navigate to="/" replace /> 
    }
    return children
 }