import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, LogOut, Package, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import './AccountPage.css';

const AccountPage = () => {
  const { user, isLoggedIn, isAdmin, logout, authLoading, getToken, updateUser } = useAuth();
  const { cart, wishlist } = useShop();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (!user) return;
    setName(user.name || '');
    fetch('http://localhost:5000/api/orders', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(response => response.ok ? response.json() : [])
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [user, getToken]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not update profile.');
      updateUser(data.user);
      setProfileMessage('Profile updated successfully.');
    } catch (error) { setProfileError(error.message); }
  };

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login?redirect=/account');
    }
  }, [authLoading, isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="account-page">
        <div className="container auth-container">
          <div className="auth-card" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="account-page">
      <div className="container auth-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <div className="profile-email"><Mail size={14} /> {user.email}</div>
              {isAdmin && (
                <span className="profile-role-badge">
                  <ShieldCheck size={13} /> Admin
                </span>
              )}
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-icon"><Package size={20} /></span>
              <span className="stat-value">{orders.length}</span>
              <span className="stat-label">Orders</span>
            </div>
            <div className="profile-stat">
              <span className="stat-icon"><Heart size={20} /></span>
              <span className="stat-value">{wishlist.length}</span>
              <span className="stat-label">Wishlist</span>
            </div>
          </div>

          <form className="profile-edit" onSubmit={saveProfile}>
            <h2>Update Profile</h2>
            <label htmlFor="profile-name">Name</label>
            <input id="profile-name" value={name} onChange={event => setName(event.target.value)} required />
            <button type="submit" className="btn btn-primary">Save Changes</button>
            {profileMessage && <p role="status">{profileMessage}</p>}
            {profileError && <p role="alert" className="profile-error">{profileError}</p>}
          </form>

          <section className="account-orders">
            <h2>My Orders</h2>
            {orders.length === 0 ? <p>Your orders will appear here after checkout.</p> : orders.map(order => (
              <article className="account-order" key={order.id}>
                <div><strong>Order #SP-{order.id}</strong><span>{new Date(`${order.created_at}Z`).toLocaleDateString()}</span></div>
                <p>{order.items.map(item => `${item.name} × ${item.quantity}`).join(', ')}</p>
                <div><span>{order.status} · {order.payment_status.replaceAll('_', ' ')}</span><strong>Rs. {order.total.toLocaleString()}</strong></div>
              </article>
            ))}
          </section>

          <div className="profile-actions">
            <Link to="/cart" className="profile-action-btn">
              <Package size={18} /> View Cart
            </Link>
            <Link to="/wishlist" className="profile-action-btn">
              <Heart size={18} /> Wishlist
            </Link>
            {isAdmin && (
              <Link to="/admin" className="profile-action-btn admin-btn">
                <ShieldCheck size={18} /> Admin Panel
              </Link>
            )}
            <button className="profile-action-btn logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
