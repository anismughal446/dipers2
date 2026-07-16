import React, { useState, useEffect } from 'react';
import './Sidebar.css';

const API_URL = 'http://localhost:5000/api';

const Sidebar = ({ selectedVendor, onVendorChange }) => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/vendors`)
      .then(res => res.json())
      .then(data => setVendors(data))
      .catch(() => {});
  }, []);

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
                checked={selectedVendor === ''}
                onChange={() => onVendorChange('')}
              />
              <span className="custom-check"></span>
              All Brands
            </label>
          </li>
          {vendors.map(v => (
            <li key={v}>
              <label className="filter-checkbox">
                <input
                  type="radio"
                  name="vendor"
                  checked={selectedVendor === v}
                  onChange={() => onVendorChange(v)}
                />
                <span className="custom-check"></span>
                {v}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Price Range</h3>
        <ul className="filter-list">
          <li><label className="filter-checkbox"><input type="checkbox" /><span className="custom-check"></span>Under Rs. 1,000</label></li>
          <li><label className="filter-checkbox"><input type="checkbox" /><span className="custom-check"></span>Rs. 1,000 – Rs. 2,000</label></li>
          <li><label className="filter-checkbox"><input type="checkbox" /><span className="custom-check"></span>Rs. 2,000 & above</label></li>
        </ul>
      </div>

      <div className="filter-group">
        <h3 className="filter-title">Availability</h3>
        <ul className="filter-list">
          <li><label className="filter-checkbox"><input type="checkbox" defaultChecked /><span className="custom-check"></span>In Stock</label></li>
          <li><label className="filter-checkbox"><input type="checkbox" /><span className="custom-check"></span>Out of Stock</label></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
