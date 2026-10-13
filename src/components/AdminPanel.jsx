import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Package, Plus, Trash2, TrendingUp, TrendingDown,
  Search, RefreshCw, AlertCircle, CheckCircle, X, Edit3, Save, BarChart2, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';

const API_URL = 'http://localhost:5000/api';
const CATEGORIES = ['fashion', 'gear', 'feeding', 'bath', 'safety', 'toys', 'diapering', 'nursery', 'moms', 'school'];

const AdminPanel = () => {
  const { isLoggedIn, isAdmin, getToken, authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add product form
  const [addForm, setAddForm] = useState({
    name: '', brand: '', price: '', old_price: '',
    image: '', category: 'fashion', vendor: '',
    is_sale: false, is_new: false, stock: '100'
  });

  // Guard
  useEffect(() => {
    if (!authLoading && (!isLoggedIn || !isAdmin)) {
      navigate('/login');
    }
  }, [authLoading, isLoggedIn, isAdmin, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const authFetch = useCallback((url, options = {}) => {
    const token = getToken();
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers
      }
    });
  }, [getToken]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    authFetch(`${API_URL}/admin/products`)
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => { showToast('Failed to load products', 'error'); setLoading(false); });
  }, [authFetch]);

  const fetchUsers = useCallback(() => {
    authFetch(`${API_URL}/admin/users`)
      .then(r => r.json())
      .then(setUsers)
      .catch(() => {});
  }, [authFetch]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchUsers();
    }
  }, [isAdmin, fetchProducts, fetchUsers]);

  // ─── Delete Product ─────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`${API_URL}/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Product deleted successfully');
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
    setDeleteConfirm(null);
  };

  // ─── Stock Update ────────────────────────────────────────────
  const handleStockUpdate = async (id, delta) => {
    try {
      const res = await authFetch(`${API_URL}/admin/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ delta })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p =>
          p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
        ));
      }
    } catch {
      showToast('Stock update failed', 'error');
    }
  };

  const handleStockInput = async (id, newStock) => {
    const val = parseInt(newStock);
    if (isNaN(val) || val < 0) return;
    try {
      const res = await authFetch(`${API_URL}/admin/products/${id}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stock: val })
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: val } : p));
        showToast('Stock updated');
      }
    } catch {
      showToast('Stock update failed', 'error');
    }
  };

  // ─── Add Product ─────────────────────────────────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${API_URL}/admin/products`, {
        method: 'POST',
        body: JSON.stringify({
          ...addForm,
          price: parseInt(addForm.price),
          old_price: addForm.old_price ? parseInt(addForm.old_price) : null,
          stock: parseInt(addForm.stock) || 100
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Product added successfully! ✅');
        setAddForm({ name: '', brand: '', price: '', old_price: '', image: '', category: 'fashion', vendor: '', is_sale: false, is_new: false, stock: '100' });
        fetchProducts();
        setActiveTab('products');
      } else {
        showToast(data.error || 'Failed to add product', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  // ─── Edit Product ─────────────────────────────────────────────
  const handleEditSave = async (product) => {
    try {
      const res = await authFetch(`${API_URL}/admin/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
      });
      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? product : p));
        setEditingProduct(null);
        showToast('Product updated');
      }
    } catch {
      showToast('Update failed', 'error');
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner" />
        <p>Checking admin access...</p>
      </div>
    );
  }

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  // Stats
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => (p.stock || 0) < 10).length;
  const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;

  return (
    <div className="admin-page">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-icon">🗑️</div>
            <h3>Delete Product?</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This cannot be undone.</p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="admin-modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="admin-modal admin-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Edit Product</h3>
              <button onClick={() => setEditingProduct(null)}><X size={20} /></button>
            </div>
            <div className="admin-edit-form">
              {['name','brand','price','old_price','image','vendor'].map(field => (
                <div className="admin-field" key={field}>
                  <label>{field.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                  <input
                    type={['price','old_price'].includes(field) ? 'number' : 'text'}
                    value={editingProduct[field] || ''}
                    onChange={e => setEditingProduct({...editingProduct, [field]: e.target.value})}
                  />
                </div>
              ))}
              <div className="admin-field">
                <label>Category</label>
                <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-field-row">
                <label className="admin-checkbox-label">
                  <input type="checkbox" checked={!!editingProduct.is_sale} onChange={e => setEditingProduct({...editingProduct, is_sale: e.target.checked})} />
                  On Sale
                </label>
                <label className="admin-checkbox-label">
                  <input type="checkbox" checked={!!editingProduct.is_new} onChange={e => setEditingProduct({...editingProduct, is_new: e.target.checked})} />
                  New Arrival
                </label>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setEditingProduct(null)}>Cancel</button>
              <button className="admin-btn admin-btn-primary" onClick={() => handleEditSave(editingProduct)}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title">
            <ShieldCheck size={28} />
            <div>
              <h1>Admin Panel</h1>
              <p>Sproutello Store Management</p>
            </div>
          </div>
          <button className="admin-btn admin-btn-ghost" onClick={fetchProducts}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue"><Package size={22} /></div>
          <div>
            <span className="admin-stat-value">{totalProducts}</span>
            <span className="admin-stat-label">Total Products</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon yellow"><AlertCircle size={22} /></div>
          <div>
            <span className="admin-stat-value">{lowStockCount}</span>
            <span className="admin-stat-label">Low Stock (&lt;10)</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon red"><X size={22} /></div>
          <div>
            <span className="admin-stat-value">{outOfStockCount}</span>
            <span className="admin-stat-label">Out of Stock</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon purple"><Users size={22} /></div>
          <div>
            <span className="admin-stat-value">{users.length}</span>
            <span className="admin-stat-label">Registered Users</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[
          { id: 'products', icon: <Package size={16} />, label: 'Products' },
          { id: 'add', icon: <Plus size={16} />, label: 'Add Product' },
          { id: 'stock', icon: <BarChart2 size={16} />, label: 'Stock Manager' },
          { id: 'users', icon: <Users size={16} />, label: 'Users' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="admin-content">

        {/* ─── Products Tab ─── */}
        {activeTab === 'products' && (
          <div className="admin-products-tab">
            <div className="admin-filters">
              <div className="admin-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search by name or brand..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  id="admin-product-search"
                />
              </div>
              <select className="admin-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {loading ? (
              <div className="admin-loading-inline">
                <div className="admin-loading-spinner" />
                <span>Loading products...</span>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Flags</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className={(p.stock || 0) === 0 ? 'row-out-of-stock' : (p.stock || 0) < 10 ? 'row-low-stock' : ''}>
                        <td>
                          <div className="admin-product-cell">
                            <img src={p.image} alt={p.name} className="admin-product-thumb" onError={e => e.target.src = 'https://via.placeholder.com/40'} />
                            <div>
                              <span className="admin-product-name">{p.name}</span>
                              <span className="admin-product-brand">{p.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td><span className="admin-cat-badge">{p.category}</span></td>
                        <td>
                          <div>
                            <span className="admin-price">Rs. {p.price?.toLocaleString()}</span>
                            {p.old_price && <span className="admin-old-price">Rs. {p.old_price?.toLocaleString()}</span>}
                          </div>
                        </td>
                        <td>
                          <span className={`admin-stock-badge ${(p.stock || 0) === 0 ? 'out' : (p.stock || 0) < 10 ? 'low' : 'ok'}`}>
                            {p.stock || 0} units
                          </span>
                        </td>
                        <td>
                          {p.is_sale ? <span className="admin-flag sale">Sale</span> : null}
                          {p.is_new ? <span className="admin-flag new">New</span> : null}
                        </td>
                        <td>
                          <div className="admin-action-btns">
                            <button className="admin-icon-btn edit" onClick={() => setEditingProduct({...p})} title="Edit">
                              <Edit3 size={15} />
                            </button>
                            <button className="admin-icon-btn delete" onClick={() => setDeleteConfirm(p)} title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} className="admin-empty">No products found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── Add Product Tab ─── */}
        {activeTab === 'add' && (
          <div className="admin-add-tab">
            <h2>Add New Product</h2>
            <form className="admin-add-form" onSubmit={handleAddProduct} id="admin-add-product-form">
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Product Name *</label>
                  <input required type="text" placeholder="e.g. Baby Romper Set" value={addForm.name} onChange={e => setAddForm({...addForm, name: e.target.value})} id="add-name" />
                </div>
                <div className="admin-field">
                  <label>Brand *</label>
                  <input required type="text" placeholder="e.g. BabyPlanet" value={addForm.brand} onChange={e => setAddForm({...addForm, brand: e.target.value})} id="add-brand" />
                </div>
                <div className="admin-field">
                  <label>Price (Rs.) *</label>
                  <input required type="number" min="0" placeholder="1500" value={addForm.price} onChange={e => setAddForm({...addForm, price: e.target.value})} id="add-price" />
                </div>
                <div className="admin-field">
                  <label>Original Price (Rs.)</label>
                  <input type="number" min="0" placeholder="2000 (optional)" value={addForm.old_price} onChange={e => setAddForm({...addForm, old_price: e.target.value})} id="add-old-price" />
                </div>
                <div className="admin-field admin-field-full">
                  <label>Image URL *</label>
                  <input required type="text" placeholder="https://..." value={addForm.image} onChange={e => setAddForm({...addForm, image: e.target.value})} id="add-image" />
                  {addForm.image && (
                    <div className="admin-img-preview">
                      <img src={addForm.image} alt="preview" onError={e => { e.target.style.display='none'; }} />
                    </div>
                  )}
                </div>
                <div className="admin-field">
                  <label>Category *</label>
                  <select required value={addForm.category} onChange={e => setAddForm({...addForm, category: e.target.value})} id="add-category">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Vendor *</label>
                  <input required type="text" placeholder="e.g. BabyPlanet" value={addForm.vendor} onChange={e => setAddForm({...addForm, vendor: e.target.value})} id="add-vendor" />
                </div>
                <div className="admin-field">
                  <label>Initial Stock</label>
                  <input type="number" min="0" placeholder="100" value={addForm.stock} onChange={e => setAddForm({...addForm, stock: e.target.value})} id="add-stock" />
                </div>
                <div className="admin-field admin-field-full admin-field-checkboxes">
                  <label className="admin-checkbox-label">
                    <input type="checkbox" checked={addForm.is_sale} onChange={e => setAddForm({...addForm, is_sale: e.target.checked})} id="add-is-sale" />
                    Mark as On Sale
                  </label>
                  <label className="admin-checkbox-label">
                    <input type="checkbox" checked={addForm.is_new} onChange={e => setAddForm({...addForm, is_new: e.target.checked})} id="add-is-new" />
                    Mark as New Arrival
                  </label>
                </div>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary admin-submit-btn" id="add-product-submit">
                <Plus size={18} /> Add Product
              </button>
            </form>
          </div>
        )}

        {/* ─── Stock Manager Tab ─── */}
        {activeTab === 'stock' && (
          <div className="admin-stock-tab">
            <div className="admin-filters">
              <div className="admin-search">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  id="admin-stock-search"
                />
              </div>
              <select className="admin-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-stock-grid">
              {filtered.map(p => (
                <div key={p.id} className={`admin-stock-card ${(p.stock || 0) === 0 ? 'out' : (p.stock || 0) < 10 ? 'low' : ''}`}>
                  <img src={p.image} alt={p.name} className="admin-stock-img" onError={e => e.target.src = 'https://via.placeholder.com/60'} />
                  <div className="admin-stock-info">
                    <span className="admin-stock-name">{p.name}</span>
                    <span className="admin-cat-badge">{p.category}</span>
                  </div>
                  <div className="admin-stock-controls">
                    <button
                      className="admin-stock-btn minus"
                      onClick={() => handleStockUpdate(p.id, -1)}
                      disabled={(p.stock || 0) === 0}
                      title="Stock Out (-1)"
                    >
                      <TrendingDown size={14} />
                    </button>
                    <input
                      type="number"
                      className="admin-stock-input"
                      value={p.stock || 0}
                      min="0"
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setProducts(prev => prev.map(pr => pr.id === p.id ? {...pr, stock: val} : pr));
                      }}
                      onBlur={e => handleStockInput(p.id, e.target.value)}
                    />
                    <button
                      className="admin-stock-btn plus"
                      onClick={() => handleStockUpdate(p.id, 1)}
                      title="Stock In (+1)"
                    >
                      <TrendingUp size={14} />
                    </button>
                  </div>
                  <span className={`admin-stock-status ${(p.stock || 0) === 0 ? 'out' : (p.stock || 0) < 10 ? 'low' : 'ok'}`}>
                    {(p.stock || 0) === 0 ? 'Out of Stock' : (p.stock || 0) < 10 ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Users Tab ─── */}
        {activeTab === 'users' && (
          <div className="admin-users-tab">
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><span className="admin-id">#{u.id}</span></td>
                      <td><strong>{u.name}</strong></td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-role-badge ${u.role}`}>{u.role}</span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="admin-empty">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
