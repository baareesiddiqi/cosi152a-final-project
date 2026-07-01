import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import './Listings.css'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/myorders').then(({ data }) => setOrders(data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 24 }}>Order History</h1>
        {loading ? <div className="spinner" /> : orders.length === 0 ? (
          <div className="empty-state">
            <h3>No orders yet</h3>
            <p>Your orders will appear here after you make a purchase.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="listings-table">
            {orders.map(o => (
              <div key={o._id} className="listing-row card">
                <div className="listing-info">
                  <div className="listing-name">Order #{o._id.slice(-8).toUpperCase()}</div>
                  <div className="listing-meta">
                    {new Date(o.createdAt).toLocaleDateString()} · ${o.totalPrice.toFixed(2)} · {o.orderItems.length} item{o.orderItems.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span className={`badge ${o.isPaid ? 'badge-success' : 'badge-danger'}`}>
                    {o.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`badge ${o.isDelivered ? 'badge-success' : 'badge-warning'}`}>
                    {o.isDelivered ? 'Delivered' : 'Pending'}
                  </span>
                  <Link to={`/orders/${o._id}`} className="btn btn-secondary btn-sm">View</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
