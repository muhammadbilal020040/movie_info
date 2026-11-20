import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STUDENT_CREDIT } from '../../utils/constants';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/movies', label: 'Movies' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/genres', label: 'Genres' },
  { to: '/', label: 'View site' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();

  return (
    <div className="admin-shell">
      <div className="admin-mobile-nav">
        <div className="brand">Admin{admin?.name ? ` (${admin.name})` : ''}</div>
        <div className="admin-mobile-links">
          {links.map((link) => (
            <NavLink key={link.to} className="nav-link" to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
          <button type="button" className="nav-link border-0" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="px-2 mb-3">
            <div className="fw-semibold text-white">Admin Panel</div>
            <div className="small text-white-50 text-break-safe">{admin?.name || 'Administrator'}</div>
          </div>
          <nav className="nav flex-column">
            {links.map((link) => (
              <NavLink key={link.to} className="nav-link" to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
            <button type="button" className="nav-link text-start btn btn-link" onClick={logout}>
              Logout
            </button>
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
          <div className="student-watermark small mt-5 pt-3 border-top">{STUDENT_CREDIT}</div>
        </main>
      </div>
    </div>
  );
}
