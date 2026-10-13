import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryList.css';
import { productImageUrl } from '../utils/productContent';

const categories = [
  { name: 'Fashion', slug: 'fashion', image: '/bp/cdn/shop/files/B187001203750000_105c7f7d-62a0-458a-a3be-3da6dc94b61d.png?width=600', color: '#fce4ec' },
  { name: 'Gear', slug: 'gear', image: '/bp/cdn/shop/files/B207007001000011_92037169-841e-4018-8913-f5951c908ada.png?width=600', color: '#e3f2fd' },
  { name: 'Feeding', slug: 'feeding', image: '/bp/cdn/shop/files/B187003015810000_afef9538-23ec-4109-948e-ca8852ea4097.png?width=600', color: '#fff3e0' },
  { name: 'Bath & Skin', slug: 'bath', image: '/bp/cdn/shop/files/B187004006260000_6635e236-8c4c-4f10-926e-1f1cd7231d05.png?width=600', color: '#e8f5e9' },
  { name: 'Safety', slug: 'safety', image: '/bp/cdn/shop/files/B187005001280000_9301b7c5-3507-4f08-a6d8-0e4a36b9f510.png', color: '#f3e5f5' },
  { name: 'Toys', slug: 'toys', image: '/bp/cdn/shop/files/B204001019492203_d0052073-ef33-423f-b069-c7ecd7ee6bc8.png?width=600', color: '#fff8e1' },
  { name: 'Diapering', slug: 'diapering', image: '/bp/cdn/shop/files/B187007007350008_01064fb3-6276-48e1-b507-f58762e66eb3.png?width=600', color: '#e0f7fa' },
  { name: 'Nursery', slug: 'nursery', image: '/bp/cdn/shop/files/B187001204330008_1708774c-fab0-451b-9dd8-4af64493de5d.png?width=600', color: '#fce4ec' },
  { name: 'Moms', slug: 'moms', image: '/bp/cdn/shop/files/Q79253.jpg?width=600', color: '#f1f8e9' },
  { name: 'School', slug: 'school', image: '/bp/cdn/shop/files/B187010005930000_1e1a4b09-9a07-405f-9fd5-f6c193f252a9.png?width=600', color: '#e8eaf6' },
];

const CategoryList = () => {
  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find exactly what your little one needs</p>
          <span className="underline"></span>
        </div>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className="category-card fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="category-image-wrapper">
                <img src={productImageUrl(cat.image)} alt={cat.name} className="category-image" />
              </div>
              <h3>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
