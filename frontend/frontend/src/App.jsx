
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import { store} from './app/store'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <h1 className="text-2xl font-bold">🛍️ ShopEase Home — Coming Soon!</h1>
            </div>
          </ProtectedRoute>

        } />
      </Routes>
      
      </BrowserRouter>
    </Provider>
  )
}
export default App