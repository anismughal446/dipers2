import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import './Hero.css';
import { productImageUrl } from '../utils/productContent';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content fade-in-up">
          <span className="hero-badge">🌼 A little wonder in every day</span>
          <h1>Big smiles start with <span className="gradient-text">little things</span></h1>
          <p>Find playful favorites and everyday essentials for growing kids, caring parents, and all the happy moments in between.</p>
          <div className="hero-buttons">
            <Link to="/shop/fashion" className="btn btn-primary">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link to="/shop/new-arrival" className="btn btn-secondary">
              New Arrivals
            </Link>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <Truck size={18} />
              <span>Free Delivery</span>
            </div>
            <div className="hero-feature">
              <Shield size={18} />
              <span>Secure Payment</span>
            </div>
            <div className="hero-feature">
              <RefreshCw size={18} />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
        <div className="hero-visual fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="hero-image-wrapper">
            <img
              src={productImageUrl('/bp/cdn/shop/files/01-mothersday050526.png')}
              alt="Summer baby collection"
              className="hero-img"
            />
            <div className="hero-floating-card card-1">
              <span className="floating-emoji">👶</span>
              <div>
                <strong>500+</strong>
                <small>Products</small>
              </div>
            </div>
            <div className="hero-floating-card card-2">
              <span className="floating-emoji">⭐</span>
              <div>
                <strong>4.9/5</strong>
                <small>Rating</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
