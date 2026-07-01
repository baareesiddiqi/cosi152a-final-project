import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { dispatch } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviewMsg, setReviewMsg] = useState('')
  const [reviewErr, setReviewErr] = useState('')

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const addToCart = () => {
    dispatch({ type: 'ADD', item: { ...product, qty } })
    navigate('/cart')
  }

  const submitReview = async (e) => {
    e.preventDefault()
    setReviewMsg(''); setReviewErr('')
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment })
      setReviewMsg('Review submitted!')
      setComment(''); setRating(5)
      const { data } = await api.get(`/products/${id}`)
      setProduct(data)
    } catch (err) {
      setReviewErr(err.response?.data?.message || 'Failed to submit review')
    }
  }

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />
  if (!product) return null

  const stars = Math.round(product.rating)

  return (
    <div className="page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="detail-layout">
          <div className="detail-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="detail-info">
            <span className="badge badge-accent">{product.category}</span>
            <h1 className="detail-title">{product.name}</h1>
            <div className="detail-rating">
              <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
              <span className="text-muted">{product.numReviews} review{product.numReviews !== 1 ? 's' : ''}</span>
            </div>
            <div className="detail-price">${product.price.toFixed(2)}</div>
            <p className="detail-desc">{product.description}</p>
            <div className="divider" />
            <div className="detail-seller">
              Sold by <strong>{product.seller?.name}</strong>
            </div>
            {product.countInStock > 0 ? (
              <div className="detail-buy">
                <div className="qty-select">
                  <label>Qty</label>
                  <select value={qty} onChange={e => setQty(Number(e.target.value))}>
                    {Array.from({ length: Math.min(product.countInStock, 10) }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary btn-lg" onClick={addToCart}>Add to Cart</button>
              </div>
            ) : (
              <div className="badge badge-danger" style={{ padding: '10px 16px' }}>Out of Stock</div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="reviews-section">
          <h2>Reviews</h2>
          {product.reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first!</p>
          ) : (
            product.reviews.map(r => (
              <div key={r._id} className="review-card card">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <span className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  <span className="text-muted" style={{ fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{r.comment}</p>
              </div>
            ))
          )}

          {user && (
            <div className="review-form card">
              <h3>Write a Review</h3>
              {reviewMsg && <div className="alert alert-success">{reviewMsg}</div>}
              {reviewErr && <div className="alert alert-error">{reviewErr}</div>}
              <form onSubmit={submitReview}>
                <div className="form-group">
                  <label>Rating</label>
                  <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Comment</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Submit Review</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
