import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from './ProductGrid';
import Sidebar from './Sidebar';
import './CollectionPage.css';

const API_URL = 'http://localhost:5000/api';

const categoryTitles = {
  fashion: 'Fashion',
  gear: 'Gear & Strollers',
  feeding: 'Feeding Essentials',
  bath: 'Bath & Skin Care',
  safety: 'Safety Products',
  toys: 'Toys & Games',
  diapering: 'Diapering',
  nursery: 'Nursery',
  moms: 'For Moms',
  school: 'School Essentials',
  sale: 'Sale Items 🔥',
  'new-arrival': 'New Arrivals ✨',
};

const CollectionPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');

  useEffect(() => {
    setLoading(true);
    let url = `${API_URL}/products?limit=24`;
    if (category === 'sale') {
      url += `&is_sale=1`;
    } else if (category === 'new-arrival') {
      url += `&is_new=1`;
    } else if (category) {
      url += `&category=${category}`;
    }
    if (selectedVendor) {
      url += `&vendor=${selectedVendor}`;
    }
    if (sortBy) {
      url += `&sort=${sortBy}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, selectedVendor, sortBy]);

  const title = categoryTitles[category] || 'All Products';

  return (
    <div className="collection-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="bc-sep">/</span>
          <span>{title}</span>
        </div>

        <div className="collection-layout">
          <aside className="collection-sidebar-wrapper">
            <Sidebar
              selectedVendor={selectedVendor}
              onVendorChange={setSelectedVendor}
            />
          </aside>

          <main className="collection-main">
            <div className="collection-top-bar">
              <h1 className="collection-title">{title}</h1>
              <div className="collection-controls">
                <span className="result-count">{products.length} products</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Sort by: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="collection-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-img shimmer"></div>
                    <div className="skeleton-text shimmer"></div>
                    <div className="skeleton-text short shimmer"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your filters or browse another category.</p>
                <Link to="/" className="btn btn-primary">Back to Home</Link>
              </div>
            ) : (
              <div className="collection-grid">
                {products.map((product, index) => (
                  <ProductCard key={product.id || index} product={product} />
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div className="load-more-wrap">
                <button className="btn btn-secondary">Load More Products</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
