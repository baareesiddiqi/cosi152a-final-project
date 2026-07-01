import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import api from '../utils/api'
import './PlaceOrder.css'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [clientId, setClientId] = useState('')

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false))
    api.get('/users/paypal-config').then(({ data }) => setClientId(data.clientId))
  }, [id])

  const onApprove = async (data, actions) => {
    const details = await actions.order.capture()
    await api.put(`/orders/${id}/pay`, details)
    const { data: updated } = await api.get(`/orders/${id}`)
    setOrder(updated)
  }

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />
  if (!order) return null

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ marginBottom: 4 }}>Order Details</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>#{order._id}</p>
        <div className="placeorder-layout">
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3>Shipping</h3>
              <div className="divider" />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              <div style={{ marginTop: 10 }}>
                {order.isDelivered
                  ? <span className="badge badge-success">Delivered</span>
                  : <span className="badge badge-warning">Not Delivered</span>}
              </div>
            </div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3>Payment</h3>
              <div className="divider" />
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Method: {order.paymentMethod}</p>
              <div style={{ marginTop: 10 }}>
                {order.isPaid
                  ? <span className="badge badge-success">Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                  : <span className="badge badge-danger">Not Paid</span>}
              </div>
            </div>
            <div className="card">
              <h3>Items</h3>
              <div className="divider" />
              {order.orderItems.map((i, idx) => (
                <div key={idx} className="order-item-row">
                  <img src={i.image} alt={i.name} />
                  <span className="oi-name">{i.name}</span>
                  <span className="oi-calc">{i.qty} × ${i.price.toFixed(2)} = ${(i.qty * i.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ alignSelf: 'start' }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3>Summary</h3>
              <div className="divider" />
              <div className="summary-row"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <div className="divider" />
              <div className="summary-row" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)' }}>
                <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            {!order.isPaid && clientId && (
              <PayPalScriptProvider options={{ 'client-id': clientId }}>
                <PayPalButtons
                  createOrder={(data, actions) => actions.order.create({
                    purchase_units: [{ amount: { value: order.totalPrice.toFixed(2) } }]
                  })}
                  onApprove={onApprove}
                />
              </PayPalScriptProvider>
            )}
            {!order.isPaid && !clientId && (
              <div className="alert alert-info">PayPal not configured — add PAYPAL_CLIENT_ID to backend .env</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
