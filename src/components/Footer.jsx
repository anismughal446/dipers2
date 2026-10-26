import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import { MapPin, Phone, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col footer-about">
          <Link to="/" className="footer-logo">
            <BrandMark className="footer-logo-icon" />
            <h3><span>Nunu</span>Nest</h3>
          </Link>
          <p>Your one-stop destination for premium baby & kids products. We bring you the finest selection of clothing, gear, and essentials with fast delivery across Pakistan.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop/fashion">Fashion</Link></li>
            <li><Link to="/shop/toys">Toys</Link></li>
            <li><Link to="/shop/gear">Gear</Link></li>
            <li><Link to="/shop/sale">Sale</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Information</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Returns & Exchange</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Get in Touch</h4>
          <div className="footer-contact">
            <div className="contact-row">
              <MapPin size={16} />
              <span>Office 12, Block C, Gulberg III, Lahore</span>
            </div>
            <div className="contact-row">
              <Phone size={16} />
              <span>+92 300 1234567</span>
            </div>
            <div className="contact-row">
              <Heart size={16} />
              <span>We're here to help with every little step</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} NunuNest. All rights reserved.</p>
          <div className="payment-methods">
            <span>💳</span>
            <span>🏦</span>
            <span>📱</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
