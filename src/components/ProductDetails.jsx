import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Truck, Shield, RefreshCw, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductGrid from './ProductGrid';
import './ProductDetails.css';

const API_URL = 'http://localhost:5000/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useShop();

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        // Fetch related products in same category
        return fetch(`${API_URL}/products?category=${data.category}&limit=4`);
      })
      .then(res => res.json())
      .then(data => {
        setRelated(data.filter(p => p.id !== parseInt(id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
    
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!product) return <div className="container">Product not found</div>;

  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <div className="product-details-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> <span className="bc-sep">/</span>
          <Link to={`/shop/${product.category}`}>{product.category}</Link> <span className="bc-sep">/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-main-grid">
          <div className="product-gallery">
            <div className="main-img-wrap">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="product-info">
            <span className="info-vendor">{product.brand || product.vendor}</span>
            <h1 className="info-title">{product.name}</h1>
            
            <div className="info-rating">
              <div className="stars">
                <Star size={16} fill="#f97316" color="#f97316" />
                <Star size={16} fill="#f97316" color="#f97316" />
                <Star size={16} fill="#f97316" color="#f97316" />
                <Star size={16} fill="#f97316" color="#f97316" />
                <Star size={16} color="#cbd5e1" />
              </div>
              <span>(12 Reviews)</span>
            </div>

            <div className="info-price">
              <span className="current-price">Rs. {product.price?.toLocaleString()}</span>
              {product.old_price && (
                <span className="old-price">Rs. {product.old_price?.toLocaleString()}</span>
              )}
              {product.old_price && (
                <span className="save-badge">Save Rs. {(product.old_price - product.price).toLocaleString()}</span>
              )}
            </div>

            <p className="info-description">
              This high-quality {product.name} is designed with your baby's comfort and safety in mind. 
              Made from premium materials, it's perfect for everyday use and durable enough to last.
            </p>

            <div className="info-actions">
              <div className="qty-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
              <button 
                className="btn btn-primary add-to-cart-btn"
                onClick={() => {
                  for(let i=0; i<quantity; i++) addToCart(product);
                }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                className={`wishlist-icon-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="info-features">
              <div className="feature-item">
                <Truck size={20} />
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders above Rs. 3,000</p>
                </div>
              </div>
              <div className="feature-item">
                <Shield size={20} />
                <div>
                  <strong>7-Day Warranty</strong>
                  <p>100% genuine products</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="related-section">
            <div className="section-header">
              <h2>Related Products</h2>
              <span className="underline"></span>
            </div>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
