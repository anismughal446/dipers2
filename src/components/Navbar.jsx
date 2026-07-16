import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, User, Heart, X, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const categories = [
  { name: 'Fashion', slug: 'fashion' },
  { name: 'Gear', slug: 'gear' },
  { name: 'Feeding', slug: 'feeding' },
  { name: 'Bath & Skin', slug: 'bath' },
  { name: 'Safety', slug: 'safety' },
  { name: 'Toys', slug: 'toys' },
  { name: 'Diapering', slug: 'diapering' },
  { name: 'Nursery', slug: 'nursery' },
  { name: 'Moms', slug: 'moms' },
  { name: 'School', slug: 'school' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { cart, wishlist } = useShop();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="announcement-bar">
        <div className="container">
          <p>🎉 Free delivery on orders above Rs. 3,000 — <Link to="/shop/fashion">Shop Now</Link></p>
        </div>
      </div>

      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🪺</span>
            <div className="logo-text">
              <h1>LittleNest</h1>
              <span className="logo-tagline">Baby & Kids Store</span>
            </div>
          </Link>

          <div className="nav-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="nav-actions">
            <Link to="/wishlist" className="nav-action-btn" title="Wishlist">
              <Heart size={22} />
              <span className="action-label">Wishlist</span>
              {wishlist.length > 0 && <span className="cart-count">{wishlist.length}</span>}
            </Link>

            {/* User menu */}
            {isLoggedIn ? (
              <div className="nav-user-menu" onMouseLeave={() => setUserMenuOpen(false)}>
                <button
                  className="nav-action-btn nav-user-btn"
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onClick={() => setUserMenuOpen(p => !p)}
                  title="Account"
                >
                  <div className="nav-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                  <span className="action-label">{user?.name?.split(' ')[0]}</span>
                </button>
                {userMenuOpen && (
                  <div className="nav-dropdown">
                    <div className="nav-dropdown-header">
                      <strong>{user?.name}</strong>
                      <span>{user?.email}</span>
                    </div>
                    <Link to="/account" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <User size={15} /> My Account
                    </Link>
                    <Link to="/cart" className="nav-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <ShoppingCart size={15} /> My Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="nav-dropdown-item nav-admin-link" onClick={() => setUserMenuOpen(false)}>
                        <ShieldCheck size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="nav-dropdown-divider" />
                    <button className="nav-dropdown-item nav-logout-btn" onClick={handleLogout}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-action-btn" title="Login">
                <LogIn size={22} />
                <span className="action-label">Login</span>
              </Link>
            )}

            <Link to="/cart" className="nav-action-btn cart-btn" title="Cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              <span className="action-label">Cart</span>
            </Link>
          </div>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Category Navigation */}
        <div className="cat-nav">
          <div className="container cat-nav-inner">
            <Link to="/" className="cat-link cat-home">Home</Link>
            {categories.map(cat => (
              <Link key={cat.slug} to={`/shop/${cat.slug}`} className="cat-link">
                {cat.name}
              </Link>
            ))}
            <Link to="/shop/sale" className="cat-link cat-sale">Sale 🔥</Link>
            <Link to="/shop/new-arrival" className="cat-link cat-new">New In</Link>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <h3>Menu</h3>
          <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
        </div>
        <div className="mobile-search">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
        {isLoggedIn && (
          <div className="mobile-user-info">
            <div className="mobile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
        )}
        <div className="mobile-links">
          <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          {categories.map(cat => (
            <Link key={cat.slug} to={`/shop/${cat.slug}`} onClick={() => setMobileOpen(false)}>
              {cat.name}
            </Link>
          ))}
          <Link to="/shop/sale" onClick={() => setMobileOpen(false)} className="mobile-sale">Sale 🔥</Link>
          <Link to="/account" onClick={() => setMobileOpen(false)}>Account</Link>
          {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin Panel</Link>}
          {isLoggedIn
            ? <button className="mobile-logout-btn" onClick={() => { handleLogout(); setMobileOpen(false); }}>Logout</button>
            : <Link to="/login" onClick={() => setMobileOpen(false)}>Login / Register</Link>
          }
        </div>
      </div>
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
    </>
  );
};

export default Navbar;
