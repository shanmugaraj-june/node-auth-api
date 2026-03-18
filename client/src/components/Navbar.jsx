import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className="navbar" ref={menuRef}>
        <Link to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          MediBook
        </Link>

        {/* Desktop links */}
        <div className="nav-links nav-links--desktop">
          <Link to="/doctors">Doctors</Link>
          {isLoggedIn && <Link to="/appointments">My Appointments</Link>}
        </div>

        {/* Desktop auth */}
        <div className="nav-right nav-right--desktop">
          {isLoggedIn ? (
            <>
              <span className="nav-user">{user?.name}</span>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost">Sign in</Link>
              <Link to="/register" className="btn-primary-sm">Register</Link>
            </>
          )}
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="mobile-drawer__links">
          <Link to="/doctors">Doctors</Link>
          {isLoggedIn && <Link to="/appointments">My Appointments</Link>}
        </div>
        <div className="mobile-drawer__auth">
          {isLoggedIn ? (
            <>
              <span className="nav-user">{user?.name}</span>
              <button className="btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost"      onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/register" className="btn-primary-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="mobile-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;