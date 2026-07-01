import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Shipping() {
  const { cart, dispatch } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const saved = cart.shippingAddress || user?.address || {}

  const [form, setForm] = useState({
    street: saved.street || '',
    city: saved.city || '',
    postalCode: saved.postalCode || '',
    country: saved.country || ''
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: 'SET_SHIPPING', address: form })
    navigate('/placeorder')
  }

  return (
    <div className="page auth-page">
      <div className="container">
        <div className="auth-card card">
          <h2>Shipping Address</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Street</label><input value={form.street} onChange={set('street')} required /></div>
            <div className="form-group"><label>City</label><input value={form.city} onChange={set('city')} required /></div>
            <div className="form-group"><label>Postal Code</label><input value={form.postalCode} onChange={set('postalCode')} required /></div>
            <div className="form-group"><label>Country</label><input value={form.country} onChange={set('country')} required /></div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">Continue to Review</button>
          </form>
        </div>
      </div>
    </div>
  )
}
