import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import './AuthForm.css'

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Other']

export default function CreateProduct() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', category: CATEGORIES[0], image: '', countInStock: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data } = await api.post('/products', { ...form, price: Number(form.price), countInStock: Number(form.countInStock) })
      navigate(`/products/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create listing')
    } finally { setLoading(false) }
  }

  return (
    <div className="page auth-page" style={{ alignItems: 'flex-start' }}>
      <div className="container">
        <div className="auth-card card" style={{ maxWidth: 560 }}>
          <h2>Create Listing</h2>
          <p className="auth-sub">List a product for sale on ShopWave</p>
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
            <div className="form-group"><label>Image URL</label><input value={form.image} onChange={set('image')} placeholder="https://..." /></div>
            <div className="form-group"><label>Stock Count</label><input type="number" min="0" value={form.countInStock} onChange={set('countInStock')} required /></div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating…' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
