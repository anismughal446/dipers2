import React from 'react';
import { X, ShoppingCart, Heart, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './QuickView.css';
import { productImageUrl } from '../utils/productContent';
import StoreImage from './StoreImage';

const QuickView = () => {
  const { isQuickViewOpen, quickViewProduct, closeQuickView, addToCart, toggleWishlist, wishlist } = useShop();

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const isWishlisted = wishlist.some(item => item.id === quickViewProduct.id);

  return (
    <div className="qv-overlay" onClick={closeQuickView}>
      <div className="qv-modal" onClick={e => e.stopPropagation()}>
        <button className="qv-close" onClick={closeQuickView}><X size={24} /></button>
        
        <div className="qv-grid">
          <div className="qv-img">
            <StoreImage src={productImageUrl(quickViewProduct.image)} alt={quickViewProduct.name} />
          </div>
          
          <div className="qv-info">
            <span className="qv-vendor">{quickViewProduct.brand}</span>
            <h2 className="qv-title">{quickViewProduct.name}</h2>
            
            <div className="qv-rating">
              <Star size={16} fill="#F5C95D" color="#D5A934" />
              <Star size={16} fill="#F5C95D" color="#D5A934" />
              <Star size={16} fill="#F5C95D" color="#D5A934" />
              <Star size={16} fill="#F5C95D" color="#D5A934" />
              <Star size={16} color="#cbd5e1" />
              <span>(5 reviews)</span>
            </div>

            <div className="qv-price">
              <span className="qv-price-now">Rs. {quickViewProduct.price.toLocaleString()}</span>
              {quickViewProduct.old_price && (
                <span className="qv-price-was">Rs. {quickViewProduct.old_price.toLocaleString()}</span>
              )}
            </div>

            <p className="qv-desc">
              Premium quality {quickViewProduct.name} from {quickViewProduct.brand}. 
              Crafted for maximum comfort and durability.
            </p>

            <div className="qv-actions">
              <button 
                className="btn btn-primary qv-add-btn"
                onClick={() => {
                  addToCart(quickViewProduct);
                  closeQuickView();
                }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button 
                className={`qv-wish-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(quickViewProduct)}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
            
            <button className="qv-view-details" onClick={closeQuickView}>
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
