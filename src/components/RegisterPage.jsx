import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/';

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const passwordStrength = (pw) => {
    if (!pw) return null;
    if (pw.length < 6) return 'weak';
    if (pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) return 'strong';
    return 'medium';
  };

  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirm) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-shapes">
        <div className="auth-shape auth-shape-1" />
        <div className="auth-shape auth-shape-2" />
        <div className="auth-shape auth-shape-3" />
      </div>

      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-card-left">
            <div className="auth-card-branding">
              <span className="auth-logo-icon">🪺</span>
              <h2>Join LittleNest</h2>
              <p>Create an account to start shopping</p>
              <div className="auth-features">
                <div className="auth-feature">🎁 Exclusive member discounts</div>
                <div className="auth-feature">📦 Track your orders</div>
                <div className="auth-feature">❤️ Save to wishlist</div>
                <div className="auth-feature">⚡ Faster checkout</div>
              </div>
            </div>
          </div>

          <div className="auth-card-right">
            <div className="auth-form-header">
              <h1>Create Account</h1>
              <p>Sign up to start shopping</p>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="reg-name">Full Name</label>
                <div className="auth-input-wrap">
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="reg-name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-email">Email Address</label>
                <div className="auth-input-wrap">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    placeholder="hello@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-password">Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="At least 6 characters"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-eye-btn"
                    onClick={() => setShowPassword(p => !p)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {strength && (
                  <div className={`strength-bar strength-${strength}`}>
                    <div className="strength-fill" />
                    <span>Password strength: {strength}</span>
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <div className="auth-input-wrap">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    name="confirm"
                    placeholder="Repeat your password"
                    required
                    value={formData.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  {formData.confirm && (
                    <span className={`confirm-icon ${formData.password === formData.confirm ? 'match' : 'mismatch'}`}>
                      {formData.password === formData.confirm
                        ? <CheckCircle size={16} />
                        : <AlertCircle size={16} />}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
                id="register-submit"
              >
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  <><UserPlus size={18} /> Create Account</>
                )}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>

            <div className="auth-switch">
              <span>Already have an account?</span>
              <Link to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="auth-switch-link">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
