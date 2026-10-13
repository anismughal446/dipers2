import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './CartPage.css';
import { productImageUrl } from '../utils/productContent';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useShop();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 3000 ? 0 : 250;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="empty-cart container">
        <div className="empty-cart-content">
          <div className="empty-icon-wrap">
            <ShoppingBag size={64} />
          </div>
          <h1>Your cart is empty</h1>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart ({cart.length} items)</h1>
        
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={productImageUrl(item.image)} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-vendor">{item.brand}</span>
                  <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-price">Rs. {item.price.toLocaleString()}</div>
                </div>
                <div className="cart-item-actions">
                  <div className="cart-qty-selector">
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="cart-item-total">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Cost</span>
                <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
              </div>
              {shipping > 0 && (
                <div className="shipping-info">
                  Free shipping on orders over Rs. 3,000
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary checkout-btn">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
              <div className="payment-icons">
                <span>🔒 Secure Checkout</span>
                <div className="icons">💳 🏦 📱</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
