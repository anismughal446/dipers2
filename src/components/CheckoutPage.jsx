import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowLeft, LogIn } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';
import { productImageUrl } from '../utils/productContent';

const paymentLabels = { cod: 'Cash on Delivery', stripe: 'Card payment (Stripe)', jazzcash: 'JazzCash', easypaisa: 'Easypaisa' };

const CheckoutPage = () => {
  const { cart, removeFromCart } = useShop();
  const { isLoggedIn, authLoading, getToken, user } = useAuth();
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [order, setOrder] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    address: '',
    city: '',
    phone: ''
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 3000 ? 0 : 250;
  const total = subtotal + shipping;

  // Guard: must be logged in
  if (!authLoading && !isLoggedIn) {
    return (
      <div className="container empty-checkout" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>🔒</div>
        <h2 style={{ marginBottom: '12px', color: '#1a1a2e' }}>Login Required</h2>
        <p style={{ color: '#666', marginBottom: '28px', fontSize: '15px' }}>
          Please login or create an account to proceed to checkout.
        </p>
        <Link to="/login?redirect=/checkout" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <LogIn size={18} /> Login to Checkout
        </Link>
        <span style={{ display: 'block', margin: '16px 0', color: '#aaa' }}>or</span>
        <Link to="/register?redirect=/checkout" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          Create Account
        </Link>
      </div>
    );
  }

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="container empty-checkout">
        <h2>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">Go Shopping</Link>
      </div>
    );
  }

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) {
      setSubmitError('');
      setSubmitting(true);
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({
            items: cart.map(({ id, name, image, price, quantity }) => ({ id, name, image, price, quantity })),
            shipping_address: { name: `${formData.firstName} ${formData.lastName}`.trim(), email: formData.email, phone: formData.phone, address: formData.address, city: formData.city },
            subtotal, shipping, total, payment_method: paymentMethod
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not place your order.');
        setOrder(data.order);
        cart.forEach(item => removeFromCart(item.id));
        setStep(3);
      } catch (error) {
        setSubmitError(error.message || 'Could not connect to the shop server.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (step === 3) {
    return (
      <div className="checkout-success container">
        <div className="success-card">
          <CheckCircle size={80} color="#0d9488" />
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with LittleNest. Your order <strong>#LN-{order?.id}</strong> has been saved to your account.</p>
          <div className="order-summary-box">
            <p><strong>Payment Method:</strong> {paymentLabels[paymentMethod]}</p>
            <p><strong>Payment Status:</strong> {paymentMethod === 'cod' ? 'Pay on delivery' : 'Pending provider setup'}</p>
            <p><strong>Total Amount:</strong> Rs. {(order?.total ?? total).toLocaleString()}</p>
          </div>
          <p className="delivery-est">Estimated Delivery: 2-4 business days</p>
          <Link to="/account" className="btn btn-primary">View My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-container">
        <div className="checkout-main">
          <div className="checkout-header">
            <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1. Shipping</div>
            <div className="step-line"></div>
            <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
          </div>

          <form onSubmit={handleNextStep}>
            {step === 1 ? (
              <div className="checkout-section">
                <h3>Contact Information</h3>
                <div className="form-group">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <h3>Shipping Address</h3>
                <div className="form-row">
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    required 
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    required 
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="text" 
                    placeholder="Address" 
                    required 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <input 
                    type="text" 
                    placeholder="City" 
                    required 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="checkout-actions">
                  <Link to="/cart" className="back-link"><ArrowLeft size={18}/> Return to Cart</Link>
                  <button type="submit" className="btn btn-primary">Continue to Payment</button>
                </div>
              </div>
            ) : (
              <div className="checkout-section">
                <h3>Payment Method</h3>
                <p className="payment-tip">Choose a payment option. Online gateways need merchant credentials before payments can be collected.</p>
                
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                    />
                    <div className="option-info">
                      <Truck size={20} />
                      <div>
                        <strong>Cash on Delivery (COD)</strong>
                        <span>Pay when your order arrives</span>
                      </div>
                    </div>
                  </label>

                  {[
                    ['stripe', 'Card payment (Stripe)', 'Hosted card checkout · setup required'],
                    ['jazzcash', 'JazzCash', 'Mobile wallet · merchant setup required'],
                    ['easypaisa', 'Easypaisa', 'Mobile wallet · merchant setup required']
                  ].map(([value, title, detail]) => (
                    <label key={value} className={`payment-option ${paymentMethod === value ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
                      <div className="option-info"><CreditCard size={20} /><div><strong>{title}</strong><span>{detail}</span></div></div>
                    </label>
                  ))}
                </div>
                {paymentMethod !== 'cod' && <p className="payment-tip">This order will be saved as pending. No card or wallet details are collected on this site.</p>}
                {submitError && <p role="alert" className="payment-tip" style={{ color: '#b91c1c' }}>{submitError}</p>}

                <div className="checkout-actions">
                  <button type="button" className="back-link" onClick={() => setStep(1)}>
                    <ArrowLeft size={18}/> Back to Shipping
                  </button>
                  <button type="submit" className="btn btn-primary complete-btn" disabled={submitting}>
                    {submitting ? 'Saving Order…' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-img">
                    <img src={productImageUrl(item.image)} alt={item.name} />
                    <span className="summary-item-qty">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <p>{item.name}</p>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
            <div className="trust-badge">
              <ShieldCheck size={18} />
              <span>100% Secure Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
