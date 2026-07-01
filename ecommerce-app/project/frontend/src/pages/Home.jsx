import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import ProductCard from '../components/ProductCard'
import './Home.css'

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Other']

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  const keyword = searchParams.get('keyword') || ''
  const category = searchParams.get('category') || 'All'
  const page = Number(searchParams.get('page') || 1)

  const [inputVal, setInputVal] = useState(keyword)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/products', {
          params: { keyword, category: category === 'All' ? '' : category, page }
        })
        setProducts(data.products)
        setPages(data.pages)
        setTotal(data.total)
      } catch {
        setError('Failed to load products.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [keyword, category, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchParams({ keyword: inputVal, category, page: 1 })
  }

  const setCategory = (cat) => setSearchParams({ keyword, category: cat, page: 1 })
  const setPage = (p) => setSearchParams({ keyword, category, page: p })

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div className="home-hero">
          <h1>Buy & Sell<br /><span className="hero-accent">Anything.</span></h1>
          <p>A marketplace where everyone can buy, sell, and discover products.</p>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search products…"
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>

        {/* Category pills */}
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`pill ${category === cat ? 'pill-active' : ''}`}
              onClick={() => setCategory(cat)}
            >{cat}</button>
          ))}
        </div>

        {/* Results info */}
        <div className="results-info">
          {keyword && <span>Results for "<strong>{keyword}</strong>" — </span>}
          <span>{total} product{total !== 1 ? 's' : ''}</span>
          {keyword && (
            <button className="clear-search" onClick={() => { setInputVal(''); setSearchParams({ category, page: 1 }) }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="spinner" />
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`page-btn ${p === page ? 'page-btn-active' : ''}`}
                onClick={() => setPage(p)}
              >{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
