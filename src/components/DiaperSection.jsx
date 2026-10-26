import React, { useEffect, useState } from 'react';
import { Baby, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductGrid';
import './DiaperSection.css';

const API_URL = 'http://localhost:5000/api';

const DiaperSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;
    fetch(`${API_URL}/products?category=diapering&limit=1000`)
      .then(response => {
        if (!response.ok) throw new Error('Could not load diaper products');
        return response.json();
      })
      .then(data => {
        if (!active) return;
        const diaperPacks = data.filter(product =>
          /diaper|nappy/i.test(product.name) &&
          !/bag|backpack|liner|toilet|seat/i.test(product.name)
        );
        setProducts(diaperPacks);
      })
      .catch(() => {
        if (active) setProducts([]);
      });

    return () => { active = false; };
  }, []);

  if (!products.length) return null;

  return (
    <section className="diaper-section">
      <div className="container">
        <div className="diaper-heading-row">
          <div className="diaper-heading-copy">
            <span className="diaper-eyebrow"><Baby size={16} /> SOFTNESS FOR EVERY LITTLE DAY</span>
            <h2>Shop Diapers by Brand</h2>
            <p>Browse diaper packs from all the brands in our catalog and shop right here at NunuNest.</p>
          </div>
          <Link className="diaper-view-all" to="/shop/diapering">Shop all diapers <ArrowRight size={16} /></Link>
        </div>

        <div className="diaper-product-grid">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
};

export default DiaperSection;
