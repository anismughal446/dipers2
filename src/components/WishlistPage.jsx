import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './WishlistPage.css';
import { productImageUrl } from '../utils/productContent';

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist container">
        <div className="empty-wishlist-content">
          <div className="empty-icon-wrap">
            <Heart size={64} />
          </div>
          <h1>Your wishlist is empty</h1>
          <p>Save your favorite items here to shop them later.</p>
          <Link to="/" className="btn btn-primary">Discover Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <h1 className="page-title">My Wishlist ({wishlist.length})</h1>
        
        <div className="wishlist-grid">
          {wishlist.map(product => (
            <div key={product.id} className="wishlist-item">
              <div className="wishlist-item-img">
                <img src={productImageUrl(product.image)} alt={product.name} />
                <button 
                  className="remove-wish-btn"
                  onClick={() => toggleWishlist(product)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="wishlist-item-details">
                <span className="item-brand">{product.brand}</span>
                <Link to={`/product/${product.id}`} className="item-name">{product.name}</Link>
                <div className="item-price">Rs. {product.price.toLocaleString()}</div>
                <button 
                  className="btn btn-primary add-from-wish-btn"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
