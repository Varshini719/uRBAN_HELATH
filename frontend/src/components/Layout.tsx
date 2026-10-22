import {
  Activity,
  Bell,
  Building2,
  CloudSun,
  FileBarChart,
  Flame,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Search,
  TreePine,
  User,
  X
} from 'lucide-react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { dashboardMock, initiativeMock, stationMock } from '../mockData';
import { useApp } from '../context';

const links = [
  ['/', 'Overview', LayoutDashboard],
  ['/hotspots', 'Heat hotspots', Flame],
  ['/green-cover', 'Green cover', TreePine],
  ['/stations', 'Weather stations', CloudSun],
  ['/initiatives', 'Cooling initiatives', Leaf],
  ['/reports', 'Reports', FileBarChart]
] as const;

const notifications = [
  { title: 'Critical heat alert', detail: 'East Industrial reached 45.1°C', time: '4 min' },
  { title: 'Station maintenance', detail: 'Industrial Estate Sensor needs inspection', time: '2 hr' },
  { title: 'Initiative update', detail: 'Cool Roofs project reached 68%', time: 'Today' }
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notices, setNotices] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, notify } = useApp();

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return [
      ...dashboardMock.districts.map((x) => ({
        name: x.name,
        meta: `District · ${x.temperature}°C`,
        to: '/hotspots'
      })),
      ...stationMock.map((x) => ({
        name: x.name,
        meta: `Station · ${x.status}`,
        to: '/stations'
      })),
      ...initiativeMock.map((x) => ({
        name: x.title,
        meta: `Initiative · ${x.progress}%`,
        to: '/initiatives'
      }))
    ]
      .filter((x) => x.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query]);

  const selectResult = (to: string) => {
    navigate(to);
    setQuery('');
  };

  const handleSignOut = () => {
    logout();
    setProfileOpen(false);
    notify('Signed out of ThermaCity console');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <span className="brand-mark">
            <Building2 size={22} />
          </span>
          <span>
            <b>ThermaCity</b>
            <small>Urban climate intelligence</small>
          </span>
        </div>
        <nav>
          {links.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-status">
          <span className="live-dot" />
          <div>
            <b>Live monitoring</b>
            <small>Systems operational</small>
          </div>
        </div>

        <div className="city-card">
          <small>SELECTED CITY</small>
          <b>Chennai Metropolitan</b>
          <span>6 districts monitored</span>
        </div>

        {user ? (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user.avatarInitials}</div>
            <div className="sidebar-user-info">
              <b>{user.name}</b>
              <small>{user.role}</small>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={handleSignOut}
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="sidebar-login-link">
            <User size={16} />
            <span>Sign in to console</span>
          </Link>
        )}
      </aside>

      {open && (
        <button
          className="overlay"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="main">
        <header className="topbar">
          <button
            className="icon-button menu"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X /> : <Menu />}
          </button>

          <div className="search-wrap">
            <div className="search">
              <Search size={18} />
              <input
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search districts, stations, initiatives..."
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={15} />
                </button>
              )}
            </div>
            {results.length > 0 && (
              <div className="search-results">
                {results.map((r, i) => (
                  <button
                    key={`${r.name}-${i}`}
                    onClick={() => selectResult(r.to)}
                  >
                    <b>{r.name}</b>
                    <small>{r.meta}</small>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="top-actions">
            <span className="sync">
              <Activity size={16} /> Updated 2 min ago
            </span>

            <div className="notice-wrap">
              <button
                className="icon-button"
                onClick={() => setNotices(!notices)}
                aria-label="Notifications"
              >
                <Bell size={19} />
                <i />
              </button>
              {notices && (
                <div className="notice-panel">
                  <header>
                    <b>Notifications</b>
                    <button
                      onClick={() => setNotices(false)}
                      aria-label="Close notifications"
                    >
                      <X size={15} />
                    </button>
                  </header>
                  {notifications.map((n) => (
                    <button
                      key={n.title}
                      onClick={() => {
                        navigate(
                          n.title.includes('Station')
                            ? '/stations'
                            : n.title.includes('Initiative')
                            ? '/initiatives'
                            : '/hotspots'
                        );
                        setNotices(false);
                      }}
                    >
                      <span className="notice-dot" />
                      <span>
                        <b>{n.title}</b>
                        <small>{n.detail}</small>
                      </span>
                      <time>{n.time}</time>
                    </button>
                  ))}
                  <footer>All caught up</footer>
                </div>
              )}
            </div>

            {/* Profile Avatar / Dropdown */}
            <div className="profile-wrap">
              <button
                className="avatar profile-trigger-btn"
                title={user ? `${user.name} (${user.role})` : 'Sign In'}
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="User profile menu"
              >
                {user ? user.avatarInitials : <User size={16} />}
              </button>

              {profileOpen && (
                <div className="profile-panel">
                  {user ? (
                    <>
                      <div className="profile-header">
                        <div className="profile-avatar-large">
                          {user.avatarInitials}
                        </div>
                        <div className="profile-details">
                          <b>{user.name}</b>
                          <small>{user.email}</small>
                          <span className="profile-badge">{user.role}</span>
                        </div>
                      </div>
                      <div className="profile-meta">
                        <div>
                          <small>DEPARTMENT</small>
                          <span>{user.department}</span>
                        </div>
                      </div>
                      <div className="profile-actions">
                        <Link
                          to="/login"
                          className="profile-link-btn"
                          onClick={() => setProfileOpen(false)}
                        >
                          <User size={15} />
                          <span>Switch Role / Portal Login</span>
                        </Link>
                        <button
                          className="profile-signout-btn"
                          onClick={handleSignOut}
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="profile-actions">
                      <Link
                        to="/login"
                        className="primary profile-link-btn"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={15} />
                        <span>Sign In to Console</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
