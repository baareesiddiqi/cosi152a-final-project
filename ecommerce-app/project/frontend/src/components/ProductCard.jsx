import { Link } from 'react-router-dom'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const stars = Math.round(product.rating)
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-category">{product.category}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
          <span className="product-reviews">({product.numReviews})</span>
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        {product.countInStock === 0 && <span className="badge badge-danger out-of-stock">Out of Stock</span>}
      </div>
    </Link>
  )
}
