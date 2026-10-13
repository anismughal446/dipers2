import React, { useEffect, useState } from 'react';
import './Sidebar.css';

const API_URL = 'http://localhost:5000/api';

const priceOptions = [
  { value: 'under-1000', label: 'Under Rs. 1,000', max: 999 },
  { value: '1000-2000', label: 'Rs. 1,000 – Rs. 2,000', min: 1000, max: 1999 },
  { value: '2000-plus', label: 'Rs. 2,000 & above', min: 2000 },
];

const Sidebar = ({ category, isSale, isNew, selectedBrand, onBrandChange, selectedPrice, onPriceChange, availability, onAvailabilityChange }) => {
  const [brands, setBrands] = useState([]);
  const [stockCounts, setStockCounts] = useState({ in_stock: 0, out_of_stock: 0 });

  useEffect(() => {
    const params = new URLSearchParams();
    if (category && category !== 'sale' && category !== 'new-arrival') params.set('category', category);
    if (isSale) params.set('is_sale', '1');
    if (isNew) params.set('is_new', '1');
    fetch(`${API_URL}/filter-options?${params}`)
      .then(res => res.json())
      .then(data => {
        setBrands(data.brands || []);
        setStockCounts(data.availability || { in_stock: 0, out_of_stock: 0 });
      })
      .catch(() => {});
  }, [category, isSale, isNew]);

  return (
    <aside className="sidebar">
      <div className="filter-group">
        <h3 className="filter-title">Brands</h3>
        <ul className="filter-list">
          <li>
            <label className="filter-checkbox">
              <input
                type="radio"
                name="vendor"
                checked={selectedBrand === ''}
                onChange={() => onBrandChange('')}
              />
              <span className="custom-check"></span>
              All Brands
            </label>
          </li>
          {brands.map(({ brand, count }) => (
            <li key={brand}>
              <label className="filter-checkbox">
                <input
                  type="radio"
                  name="vendor"
                  checked={selectedBrand === brand}
                  onChange={() => onBrandChange(brand)}
                />
                <span className="custom-check"></span>
                {brand} <span className="filter-count">({count})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Price Range</h3>
        <ul className="filter-list">
          {priceOptions.map(option => (
            <li key={option.value}>
              <label className="filter-checkbox">
                <input type="radio" name="price-range" checked={selectedPrice === option.value} onChange={() => onPriceChange(option.value)} />
                <span className="custom-check"></span>{option.label}
              </label>
            </li>
          ))}
          {selectedPrice && <li><button type="button" className="filter-reset" onClick={() => onPriceChange('')}>Clear price filter</button></li>}
        </ul>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Availability</h3>
        <ul className="filter-list">
          <li><label className="filter-checkbox"><input type="radio" name="availability" checked={availability === ''} onChange={() => onAvailabilityChange('')} /><span className="custom-check"></span>All Items <span className="filter-count">({stockCounts.total || 0})</span></label></li>
          <li><label className="filter-checkbox"><input type="radio" name="availability" checked={availability === 'in_stock'} onChange={() => onAvailabilityChange('in_stock')} /><span className="custom-check"></span>In Stock <span className="filter-count">({stockCounts.in_stock || 0})</span></label></li>
          <li><label className="filter-checkbox"><input type="radio" name="availability" checked={availability === 'out_of_stock'} onChange={() => onAvailabilityChange('out_of_stock')} /><span className="custom-check"></span>Out of Stock <span className="filter-count">({stockCounts.out_of_stock || 0})</span></label></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
