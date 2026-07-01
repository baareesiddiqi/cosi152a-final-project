import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🌊</span>
          <span>ShopWave</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Browse</Link>
          {user && <Link to="/sell" className="nav-link">Sell</Link>}
          <Link to="/cart" className="nav-cart">
            🛒
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
          {user ? (
            <div className="nav-user">
              <button className="nav-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                {user.name.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-header">{user.name}</div>
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                  <Link to="/my-listings" onClick={() => setMenuOpen(false)}>My Listings</Link>
                  <Link to="/order-history" onClick={() => setMenuOpen(false)}>Order History</Link>
                  <div className="dropdown-divider" />
                  <button onClick={handleLogout}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
