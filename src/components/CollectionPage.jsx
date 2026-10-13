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
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [availability, setAvailability] = useState('');
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setSelectedBrand('');
    setSelectedPrice('');
    setAvailability('');
    setSortBy('');
    setPage(1);
  }, [category]);

  useEffect(() => {
    const controller = new AbortController();
    if (page === 1) setLoading(true);
    const params = new URLSearchParams({ limit: '24', page: String(page) });
    if (category === 'sale') {
      params.set('is_sale', '1');
    } else if (category === 'new-arrival') {
      params.set('is_new', '1');
    } else if (category) {
      params.set('category', category);
    }
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedPrice === 'under-1000') params.set('maxPrice', '999');
    if (selectedPrice === '1000-2000') { params.set('minPrice', '1000'); params.set('maxPrice', '1999'); }
    if (selectedPrice === '2000-plus') params.set('minPrice', '2000');
    if (availability) params.set('availability', availability);
    if (sortBy) params.set('sort', sortBy);

    fetch(`${API_URL}/products?${params}`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Could not load products.');
        setTotalProducts(Number(res.headers.get('X-Total-Count')) || 0);
        return res.json();
      })
      .then(data => {
        setProducts(current => page === 1 ? data : [...current, ...data]);
        setLoading(false);
      })
      .catch(error => { if (error.name !== 'AbortError') setLoading(false); });
    return () => controller.abort();
  }, [category, selectedBrand, selectedPrice, availability, sortBy, page]);

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
              category={category}
              isSale={category === 'sale'}
              isNew={category === 'new-arrival'}
              selectedBrand={selectedBrand}
              onBrandChange={brand => { setSelectedBrand(brand); setPage(1); }}
              selectedPrice={selectedPrice}
              onPriceChange={price => { setSelectedPrice(price); setPage(1); }}
              availability={availability}
              onAvailabilityChange={value => { setAvailability(value); setPage(1); }}
            />
          </aside>

          <main className="collection-main">
            <div className="collection-top-bar">
              <h1 className="collection-title">{title}</h1>
              <div className="collection-controls">
                <span className="result-count">Showing {products.length} of {totalProducts} products</span>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
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

            {products.length > 0 && products.length < totalProducts && (
              <div className="load-more-wrap">
                <button className="btn btn-secondary" onClick={() => setPage(current => current + 1)} disabled={loading}>
                  {loading ? 'Loading…' : 'Load More Products'}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
