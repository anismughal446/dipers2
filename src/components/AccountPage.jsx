import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ShieldCheck, LogOut, Package, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import './AccountPage.css';

const AccountPage = () => {
  const { user, isLoggedIn, isAdmin, logout, authLoading } = useAuth();
  const { cart, wishlist } = useShop();
  const navigate = useNavigate();

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
              <span className="stat-value">{cart.length}</span>
              <span className="stat-label">Cart Items</span>
            </div>
            <div className="profile-stat">
              <span className="stat-icon"><Heart size={20} /></span>
              <span className="stat-value">{wishlist.length}</span>
              <span className="stat-label">Wishlist</span>
            </div>
          </div>

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
