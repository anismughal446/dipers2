import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CategorySection.css';
import { productImageUrl } from '../utils/productContent';
import StoreImage from './StoreImage';

const API_URL = 'http://localhost:5000/api';

const CategorySection = ({ title, description, categorySlug, featuredImage, reverse }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products?category=${categorySlug}&limit=4`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch category products:', err);
        setLoading(false);
      });
  }, [categorySlug]);

  return (
    <section className={`category-section-wrap ${reverse ? 'reverse' : ''}`}>
      <div className="container">
        <div className="category-section-inner">
          {/* Big Item / Banner */}
          <div className="category-banner">
            <StoreImage src={productImageUrl(featuredImage)} alt={title} className="banner-img" />
            <div className="banner-overlay">
              <div className="banner-content">
                <h2>{title}</h2>
                <p>{description}</p>
                <Link to={`/shop/${categorySlug}`} className="btn btn-primary">
                  Shop {title} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Cards Session (Product Grid) */}
          <div className="category-products">
            {loading ? (
              <div className="loading-grid-small">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-img shimmer"></div>
                    <div className="skeleton-text shimmer"></div>
                    <div className="skeleton-text short shimmer"></div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="products-grid-small">
                {products.map(product => (
                  <Link to={`/product/${product.id}`} key={product.id} className="product-card-small">
                    <div className="product-image-small">
                      <StoreImage src={productImageUrl(product.image)} alt={product.name} />
                      {product.is_sale === 1 && <span className="badge sale">Sale</span>}
                    </div>
                    <div className="product-info-small">
                      <h4>{product.name}</h4>
                      <div className="price-small">
                        Rs. {product.price.toLocaleString()}
                        {product.old_price && (
                          <span className="old-price">Rs. {product.old_price.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
