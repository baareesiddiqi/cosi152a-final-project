import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'

import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Shipping from './pages/Shipping'
import PlaceOrder from './pages/PlaceOrder'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import MyListings from './pages/MyListings'
import CreateProduct from './pages/CreateProduct'
import EditProduct from './pages/EditProduct'
import OrderHistory from './pages/OrderHistory'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shipping" element={<PrivateRoute><Shipping /></PrivateRoute>} />
            <Route path="/placeorder" element={<PrivateRoute><PlaceOrder /></PrivateRoute>} />
            <Route path="/orders/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
            <Route path="/sell" element={<PrivateRoute><CreateProduct /></PrivateRoute>} />
            <Route path="/products/:id/edit" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
            <Route path="/order-history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          </Routes>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
