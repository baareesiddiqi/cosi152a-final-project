import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Cart.css'

export default function Cart() {
  const { cart, dispatch, subtotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  if (cart.items.length === 0) return (
    <div className="page">
      <div className="container">
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Browse products and add something you like.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Products</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 24 }}>Shopping Cart</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item._id} className="cart-item card">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-item-info">
                  <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                </div>
                <div className="cart-item-controls">
                  <select
                    value={item.qty}
                    onChange={e => dispatch({ type: 'UPDATE_QTY', id: item._id, qty: Number(e.target.value) })}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => dispatch({ type: 'REMOVE', id: item._id })}
                  >Remove</button>
                </div>
                <div className="cart-item-total">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="cart-summary card">
            <h3>Order Summary</h3>
            <div className="divider" />
            <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="divider" />
            <div className="summary-row summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 16 }}
              onClick={() => user ? navigate('/shipping') : navigate('/login?redirect=/shipping')}
            >
              Proceed to Checkout
            </button>
            {subtotal <= 100 && (
              <p className="shipping-note">Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
