import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './AuthForm.css'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Other']

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setForm({
      name: data.name, description: data.description,
      price: data.price, category: data.category,
      image: data.image, countInStock: data.countInStock
    })).catch(() => navigate('/'))
  }, [id])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.put(`/products/${id}`, { ...form, price: Number(form.price), countInStock: Number(form.countInStock) })
      navigate(`/products/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally { setLoading(false) }
  }

  if (!form) return <div className="spinner" style={{ marginTop: 80 }} />

  return (
    <div className="page auth-page" style={{ alignItems: 'flex-start' }}>
      <div className="container">
        <div className="auth-card card" style={{ maxWidth: 560 }}>
          <h2>Edit Listing</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Product Name</label><input value={form.name} onChange={set('name')} required /></div>
            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={set('description')} required /></div>
            <div className="form-group"><label>Price ($)</label><input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required /></div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={set('image')} /></div>
            <div className="form-group"><label>Stock Count</label><input type="number" min="0" value={form.countInStock} onChange={set('countInStock')} required /></div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
