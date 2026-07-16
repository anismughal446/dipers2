import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import './ProductGrid.css';

import { useShop } from '../context/ShopContext';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, openQuickView } = useShop();
  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {product.old_price && (
          <span className="sale-tag">
            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
          </span>
        )}
        <button
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product)}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <div className="product-actions">
          <button
            className="action-btn"
            title="Quick view"
            onClick={() => openQuickView(product)}
          >
            <Eye size={18} />
          </button>
          <button
            className="action-btn primary"
            title="Add to cart"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      </div>
      <div className="product-details">
        <span className="product-vendor">{product.brand || product.vendor}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-pricing">
          <span className="price-now">Rs. {product.price?.toLocaleString()}</span>
          {product.old_price && (
            <span className="price-was">Rs. {product.old_price?.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ products = [], title, subtitle }) => {
  return (
    <section className="product-grid-section">
      <div className="container">
        {title && (
          <div className="section-header">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
            <span className="underline"></span>
          </div>
        )}
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { ProductCard };
export default ProductGrid;
