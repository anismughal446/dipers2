import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryList.css';

const categories = [
  { name: 'Fashion', slug: 'fashion', image: '/bp/cdn/shop/files/02-short-sets-summer26.jpg', color: '#fce4ec' },
  { name: 'Gear', slug: 'gear', image: '/bp/cdn/shop/files/B197001008690704_ce607757-d0f0-4366-93d0-6a36ddc57290.jpg', color: '#e3f2fd' },
  { name: 'Feeding', slug: 'feeding', image: '/bp/cdn/shop/files/B187002000180000_9328e202-2fd3-4c1a-aee0-a75e90f98d05.jpg', color: '#fff3e0' },
  { name: 'Bath & Skin', slug: 'bath', image: '/bp/cdn/shop/files/B187001131100000_43e05f8c-3cf6-4a43-abd1-fbde5e70f043.jpg', color: '#e8f5e9' },
  { name: 'Safety', slug: 'safety', image: '/bp/cdn/shop/files/01-short-sets-summer26.jpg', color: '#f3e5f5' },
  { name: 'Toys', slug: 'toys', image: '/bp/cdn/shop/files/B187006000260002_b50a4764-2313-42b8-9e93-708a6237f6f1.jpg', color: '#fff8e1' },
  { name: 'Diapering', slug: 'diapering', image: '/bp/cdn/shop/files/B187001042181100_e7987b76-6513-41e3-a733-68db6b72673a.jpg', color: '#e0f7fa' },
  { name: 'Nursery', slug: 'nursery', image: '/bp/cdn/shop/files/WhatsApp_Image_2026-04-28_at_5.52.25_PM.jpg', color: '#fce4ec' },
  { name: 'Moms', slug: 'moms', image: '/bp/cdn/shop/files/B187001064000300_cfa052a9-ac44-41c2-92de-58e04f489393.jpg', color: '#f1f8e9' },
  { name: 'School', slug: 'school', image: '/bp/cdn/shop/files/B187005000010000_1_720x.jpg', color: '#e8eaf6' },
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
                <img src={cat.image} alt={cat.name} className="category-image" />
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
