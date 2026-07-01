import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import { useState } from 'react'
import './PlaceOrder.css'

export default function PlaceOrder() {
  const { cart, dispatch, subtotal } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tax = subtotal * 0.08
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const placeOrder = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/orders', {
        orderItems: cart.items.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, qty: i.qty })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: 'PayPal',
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total
      })
      dispatch({ type: 'CLEAR' })
      navigate(`/orders/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!cart.shippingAddress) { navigate('/shipping'); return null }

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 24 }}>Review Order</h1>
        <div className="placeorder-layout">
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3>Shipping</h3>
              <div className="divider" />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {cart.shippingAddress.street}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3>Items</h3>
              <div className="divider" />
              {cart.items.map(i => (
                <div key={i._id} className="order-item-row">
                  <img src={i.image} alt={i.name} />
                  <span className="oi-name">{i.name}</span>
                  <span className="oi-calc">{i.qty} × ${i.price.toFixed(2)} = ${(i.qty * i.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ alignSelf: 'start' }}>
            <h3>Order Summary</h3>
            <div className="divider" />
            <div className="summary-row"><span>Items</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            <div className="summary-row"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="divider" />
            <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
            {error && <div className="alert alert-error" style={{ marginTop: 12 }}>{error}</div>}
            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16 }} onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing Order…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
