import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STUDENT_NAME } from '../utils/constants';
import { IconUser } from './icons';
import NavSearch from './NavSearch';

function closeMainNav() {
  const el = document.getElementById('mainNav');
  if (!el || !el.classList.contains('show')) return;
  try {
    const Collapse = window.bootstrap?.Collapse;
    if (Collapse) {
      Collapse.getOrCreateInstance(el, { toggle: false }).hide();
    } else {
      el.classList.remove('show');
    }
  } catch {
    el.classList.remove('show');
  }
}

export default function Navbar() {
  const { isAuthenticated, logout, admin } = useAuth();
  const { pathname } = useLocation();
  const showNavSearch = pathname !== '/movies';

  useEffect(() => {
    closeMainNav();
  }, [pathname]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark site-navbar sticky-top">
      <div className="container align-items-center">
        <NavLink className="navbar-brand brand-lockup me-2" to="/" aria-label="MovieInfo home">
          <span className="brand-wordmark">
            Movie<span className="brand-accent">Info</span>
          </span>
        </NavLink>

        {showNavSearch ? (
          <div className="nav-search-slot flex-grow-1 me-2">
            <NavSearch />
          </div>
        ) : null}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/movies" onClick={closeMainNav}>Movies</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/categories" onClick={closeMainNav}>Categories</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/genres" onClick={closeMainNav}>Genres</NavLink>
            </li>
          </ul>

          <div className="navbar-actions">
            <span className="navbar-text small d-none d-xl-inline text-white-50 me-1">{STUDENT_NAME}</span>
            {isAuthenticated ? (
              <>
                <NavLink className="btn btn-sm btn-outline-light" to="/admin" onClick={closeMainNav}>Admin</NavLink>
                <button type="button" className="btn btn-sm btn-accent" onClick={logout}>
                  Logout{admin?.name ? ` (${admin.name})` : ''}
                </button>
              </>
            ) : (
              <NavLink className="btn btn-sm btn-accent btn-with-icon" to="/admin/login" onClick={closeMainNav}>
                <IconUser size={14} />
                <span>Admin Login</span>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
