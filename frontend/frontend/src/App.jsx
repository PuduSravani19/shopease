
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import { store} from './app/store'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CartPage from './pages/cartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/ordersPage'
import ProtectedRoute from './components/ProtectedRoute'

function App(){
  return(
    <Provider store = {store}>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path ="/" element={
          <ProtectedRoute>
          
          <HomePage />
          </ProtectedRoute>

        } />
         <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
           <Route path="/checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
      </Routes>
      
      </BrowserRouter>
    </Provider>
  )
}
export default App