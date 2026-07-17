import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/test-questions', label: 'Test Questions' },
  { to: '/', label: 'Dashboard' },
  { to: '/map', label: 'Map Explorer' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/rates', label: 'Per-Capita Rates' },
  { to: '/zero-accidents', label: 'Zero Accidents' },
  { to: '/provenance', label: 'Provenance' },
];

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="brand">
        <span className="dot" />
        <div>
          <h1>Accident Dashboard</h1>
          <span>DBW Project · TU Chemnitz</span>
        </div>
      </div>

      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          end={link.to === '/'}
        >
          {link.label}
        </NavLink>
      ))}

      <div className="footnote">
        Data: Unfallatlas &amp; Regionalstatistik.<br />
        Licence: dl-de/by-2-0.
      </div>
    </nav>
  );
}
