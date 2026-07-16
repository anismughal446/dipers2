import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from './Hero';
import CategoryList from './CategoryList';
import ProductGrid from './ProductGrid';
import CategorySection from './CategorySection';
import './HomePage.css';

const API_URL = 'http://localhost:5000/api';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch Trending
    fetch(`${API_URL}/products?limit=12`)
      .then(res => res.json())
      .then(data => {
        setFeatured(data);
      });

    // Fetch New Arrivals
    fetch(`${API_URL}/products?is_new=1&limit=8`)
      .then(res => res.json())
      .then(data => {
        setNewArrivals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="homepage">
      <Hero />
      <CategoryList />

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now</h2>
            <p>Our most popular picks for your little ones</p>
            <span className="underline"></span>
          </div>
          {loading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img shimmer"></div>
                  <div className="skeleton-text shimmer"></div>
                  <div className="skeleton-text short shimmer"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={featured} />
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="new-arrivals-section" style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header">
            <h2>New Arrivals</h2>
            <p>Fresh styles just landed in our nest</p>
            <span className="underline"></span>
          </div>
          <ProductGrid products={newArrivals} />
          <div className="view-all-wrap">
            <Link to="/shop/new-arrival" className="btn btn-secondary">
              View All New Arrivals <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Category Specific Sections */}
      <CategorySection 
        title="Fashion Collection"
        description="Discover the latest trends in baby and kids fashion."
        categorySlug="fashion"
        featuredImage="/bp/cdn/shop/files/02-short-sets-summer26.jpg"
      />

      <CategorySection 
        title="Baby Gear"
        description="Premium strollers, car seats, and carriers for your travels."
        categorySlug="gear"
        featuredImage="/bp/cdn/shop/files/B197001008690704_ce607757-d0f0-4366-93d0-6a36ddc57290.jpg"
        reverse={true}
      />

      <CategorySection 
        title="Feeding Essentials"
        description="Everything you need for feeding time."
        categorySlug="feeding"
        featuredImage="/bp/cdn/shop/files/B187002000180000_9328e202-2fd3-4c1a-aee0-a75e90f98d05.jpg"
      />

      <CategorySection 
        title="Bath & Skin"
        description="Gentle care for your baby's delicate skin."
        categorySlug="bath"
        featuredImage="/bp/cdn/shop/files/B187001131100000_43e05f8c-3cf6-4a43-abd1-fbde5e70f043.jpg"
        reverse={true}
      />

      <CategorySection 
        title="Toys & Learning"
        description="Engaging toys to spark creativity and growth."
        categorySlug="toys"
        featuredImage="/bp/cdn/shop/files/B187006000260002_b50a4764-2313-42b8-9e93-708a6237f6f1.jpg"
      />


      {/* Promo Banners */}
      <section className="promo-section">
        <div className="container promo-grid">
          <div className="promo-card promo-1">
            <div className="promo-content">
              <span className="promo-label">Summer Sale</span>
              <h3>Up to 50% Off</h3>
              <p>On selected baby fashion items</p>
              <Link to="/shop/sale" className="btn btn-accent">Shop Sale</Link>
            </div>
            <img src="/bp/cdn/shop/files/01-short-sets-summer26.jpg" alt="Promo 1" className="promo-img" />
          </div>
          <div className="promo-card promo-2">
            <div className="promo-content">
              <span className="promo-label">New Arrivals</span>
              <h3>Fresh Styles</h3>
              <p>Explore the latest collections</p>
              <Link to="/shop/new-arrival" className="btn btn-primary">Explore</Link>
            </div>
            <img src="/bp/cdn/shop/files/B187006000260002_b50a4764-2313-42b8-9e93-708a6237f6f1.jpg" alt="Promo 2" className="promo-img" />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="container trust-grid">
          <div className="trust-item">
            <div className="trust-icon">🚚</div>
            <h4>Free Shipping</h4>
            <p>On orders over Rs. 3,000</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">🔒</div>
            <h4>Secure Payment</h4>
            <p>100% secure transactions</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">↩️</div>
            <h4>Easy Returns</h4>
            <p>7-day return policy</p>
          </div>
          <div className="trust-item">
            <div className="trust-icon">💬</div>
            <h4>24/7 Support</h4>
            <p>Dedicated customer care</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
