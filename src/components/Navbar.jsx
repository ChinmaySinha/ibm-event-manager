import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiOutlineLogout, HiOutlineUser, HiOutlinePlus } from 'react-icons/hi';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const getInitials = () => {
    if (!user) return '?';
    if (user.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.email?.[0]?.toUpperCase() || '?';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <div className="navbar__brand-icon">EM</div>
          <span className="navbar__brand-text">IBM Event Manager</span>
        </Link>

        <div className="navbar__links">
          <Link
            to="/"
            className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
          >
            Events
          </Link>
          <Link
            to="/create"
            className={`navbar__link ${isActive('/create') ? 'navbar__link--active' : ''}`}
          >
            <HiOutlinePlus style={{ marginRight: 4 }} />
            Create
          </Link>
        </div>

        <div className="navbar__user" ref={dropdownRef}>
          <div
            className="navbar__avatar"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {getInitials()}
          </div>

          {showDropdown && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdown-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4, paddingBottom: 12, flexDirection: 'column', alignItems: 'flex-start', gap: 2, cursor: 'default' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                  {user?.displayName || 'User'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {user?.email}
                </span>
              </div>
              <button
                className="navbar__dropdown-item navbar__dropdown-item--danger"
                onClick={handleLogout}
              >
                <HiOutlineLogout />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
