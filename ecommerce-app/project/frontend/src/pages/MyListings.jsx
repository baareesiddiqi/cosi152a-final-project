import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import './Listings.css'

export default function MyListings() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/products', { params: { limit: 100 } })
      .then(({ data }) => setProducts(data.products.filter(p => p.seller?._id === user._id || p.seller === user._id)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const deleteProduct = async (id) => {
    if (!confirm('Delete this listing?')) return
    await api.delete(`/products/${id}`)
    setProducts(p => p.filter(x => x._id !== id))
  }

  return (
    <div className="page">
      <div className="container">
        <div className="listings-header">
          <h1>My Listings</h1>
          <Link to="/sell" className="btn btn-primary">+ New Listing</Link>
        </div>
        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <div className="empty-state">
            <h3>No listings yet</h3>
            <p>Start selling by creating your first listing.</p>
            <Link to="/sell" className="btn btn-primary" style={{ marginTop: 20 }}>Create Listing</Link>
          </div>
        ) : (
          <div className="listings-table">
            {products.map(p => (
              <div key={p._id} className="listing-row card">
                <img src={p.image} alt={p.name} className="listing-img" />
                <div className="listing-info">
                  <div className="listing-name">{p.name}</div>
                  <div className="listing-meta">{p.category} · ${p.price.toFixed(2)} · {p.countInStock} in stock</div>
                </div>
                <div className="listing-actions">
                  <Link to={`/products/${p._id}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
