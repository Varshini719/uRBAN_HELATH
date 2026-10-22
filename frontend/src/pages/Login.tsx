import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Flame,
  Radio,
  Leaf,
  CheckCircle2,
  Info,
  Sparkles,
  User,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context';
import { Modal } from '../components/Modal';
import { api } from '../api';
import type { UserProfile } from '../types';

interface DemoRole {
  title: string;
  shortRole: string;
  name: string;
  email: string;
  password: string;
  department: string;
  initials: string;
  badge: string;
  icon: typeof Building2;
}

const DEMO_ROLES: DemoRole[] = [
  {
    title: 'City Planner',
    shortRole: 'Chief Resilience Officer',
    name: 'Dr. Anita Prasad',
    email: 'anita.prasad@city.gov.in',
    password: 'planner@therma2026',
    department: 'Urban Heat Mitigation Taskforce',
    initials: 'AP',
    badge: 'Executive Access',
    icon: Building2
  },
  {
    title: 'Climate Analyst',
    shortRole: 'GIS & Heat Modeler',
    name: 'Vikram Raman',
    email: 'vikram.raman@city.gov.in',
    password: 'analyst@therma2026',
    department: 'Atmospheric Data & Hotspot Modeling',
    initials: 'VR',
    badge: 'Analytical Lead',
    icon: Flame
  },
  {
    title: 'Sensor Tech',
    shortRole: 'IoT Network Lead',
    name: 'Kavitha S.',
    email: 'kavitha.s@city.gov.in',
    password: 'sensors@therma2026',
    department: 'Field Sensor Operations',
    initials: 'KS',
    badge: 'Operations Access',
    icon: Radio
  }
];

export function Login() {
  const navigate = useNavigate();
  const { login, notify } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign In state
  const [selectedRole, setSelectedRole] = useState<DemoRole>(DEMO_ROLES[0]);
  const [email, setEmail] = useState(DEMO_ROLES[0].email);
  const [password, setPassword] = useState(DEMO_ROLES[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Urban Planning Directorate');
  const [regRole, setRegRole] = useState('City Planner');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgree, setRegAgree] = useState(true);

  const handleSelectRole = (role: DemoRole) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword(role.password);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      notify('Please enter both official email and password', 'info');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Check registered accounts first
      try {
        const stored = localStorage.getItem('thermacity-registered-users');
        if (stored) {
          const list = JSON.parse(stored) as Array<UserProfile & { password?: string }>;
          const match = list.find((u) => u.email.toLowerCase() === email.toLowerCase());
          if (match) {
            login(match);
            notify(`Welcome back, ${match.name}`);
            setIsLoading(false);
            navigate('/');
            return;
          }
        }
      } catch {
        // ignore
      }

      const userProfile: UserProfile = {
        id: `usr_${Date.now().toString().slice(-4)}`,
        name: selectedRole.email === email ? selectedRole.name : email.split('@')[0].replace('.', ' '),
        email,
        role: selectedRole.email === email ? selectedRole.shortRole : 'Authorized Planner',
        department: selectedRole.email === email ? selectedRole.department : 'Urban Operations',
        avatarInitials:
          selectedRole.email === email
            ? selectedRole.initials
            : email.slice(0, 2).toUpperCase(),
        badge: selectedRole.badge
      };

      login(userProfile);
      notify(`Welcome back, ${userProfile.name}`);
      setIsLoading(false);
      navigate('/');
    }, 500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      notify('Please fill in all required registration fields', 'info');
      return;
    }

    if (regPassword.length < 6) {
      notify('Password must be at least 6 characters long', 'info');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      notify('Passwords do not match. Please re-enter.', 'info');
      return;
    }

    if (!regAgree) {
      notify('Please accept the Climate Intelligence Data Governance Policy', 'info');
      return;
    }

    setIsLoading(true);

    const initials = regName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .filter(Boolean)
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'UR';

    const newProfile: UserProfile = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      department: regDept,
      avatarInitials: initials,
      badge: 'Registered Officer'
    };

    // Save in registered users list
    try {
      const stored = localStorage.getItem('thermacity-registered-users');
      const list = stored ? (JSON.parse(stored) as UserProfile[]) : [];
      list.push(newProfile);
      localStorage.setItem('thermacity-registered-users', JSON.stringify(list));
    } catch {
      // ignore
    }

    // Attempt backend registration call
    api.register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      department: regDept,
      role: regRole
    }).catch(() => null);

    setTimeout(() => {
      login(newProfile);
      notify(`Account registered successfully! Welcome, ${newProfile.name}`);
      setIsLoading(false);
      navigate('/');
    }, 550);
  };

  const handleGuestAccess = () => {
    const guestUser: UserProfile = {
      id: 'usr_guest',
      name: 'Guest Observer',
      email: 'guest.observer@city.gov.in',
      role: 'Public Climate Viewer',
      department: 'Civic Data Portal',
      avatarInitials: 'GO',
      badge: 'Read-Only'
    };
    login(guestUser);
    notify('Signed in as Guest Observer');
    navigate('/');
  };

  return (
    <div className="login-root">
      {/* Background Ambience */}
      <div className="login-backdrop-glow top-glow" />
      <div className="login-backdrop-glow bottom-glow" />

      <div className="login-container">
        {/* Left Hero / Brand & Mission Column */}
        <section className="login-hero">
          <div className="login-hero-header">
            <Link to="/" className="brand login-brand" style={{ textDecoration: 'none' }}>
              <span className="brand-mark">
                <Building2 size={24} />
              </span>
              <div>
                <b>ThermaCity</b>
                <small>Urban Climate Intelligence</small>
              </div>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to="/"
                className="text-link"
                style={{ color: '#a6cfc3', fontSize: '11px', textDecoration: 'none' }}
              >
                ← Public View
              </Link>
              <span className="pill live">
                <i />
                SYSTEMS ACTIVE
              </span>
            </div>
          </div>

          <div className="login-hero-body">
            <span className="eyebrow hero-eyebrow">
              MUNICIPAL HEAT & RESILIENCE PLATFORM
            </span>
            <h1>Smarter monitoring. Cooler communities.</h1>
            <p className="hero-subtext">
              Real-time thermal satellite feeds, automated weather stations,
              and strategic cooling interventions for resilient municipal districts.
            </p>

            {/* Live Telemetry Showcase Card */}
            <div className="telemetry-card">
              <div className="telemetry-top">
                <div>
                  <small>LIVE CITY SNAPSHOT</small>
                  <b>Chennai Metropolitan Area</b>
                </div>
                <span className="telemetry-temp">38.8°C</span>
              </div>

              <div className="telemetry-badges">
                <div className="telemetry-pill warning">
                  <Flame size={14} />
                  <span>2 Critical Hotspots</span>
                </div>
                <div className="telemetry-pill success">
                  <Leaf size={14} />
                  <span>22.8% Green Cover</span>
                </div>
                <div className="telemetry-pill info">
                  <Radio size={14} />
                  <span>4/6 Stations Online</span>
                </div>
              </div>

              <div className="telemetry-footer">
                <div className="pulse-indicator">
                  <span className="pulse-dot" />
                  <span>Ingesting live micro-climate sensor streams</span>
                </div>
                <span className="telemetry-updated">Updated 2m ago</span>
              </div>
            </div>

            {/* Compliance & Security Credentials */}
            <div className="login-credentials-row">
              <div className="cred-item">
                <ShieldCheck size={18} />
                <span>256-Bit Encrypted Portal</span>
              </div>
              <div className="cred-item">
                <CheckCircle2 size={18} />
                <span>ISO 14001 Resilience Ready</span>
              </div>
            </div>
          </div>

          <footer className="login-hero-footer">
            <small>
              Department of Municipal Administration & Urban Development • v1.4.0
            </small>
          </footer>
        </section>

        {/* Right Form Column */}
        <section className="login-card-section">
          <div className="login-card">
            {/* Top Switcher Tabs: Sign In vs Register */}
            <div className="auth-tab-switch">
              <button
                type="button"
                className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => setMode('signin')}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                onClick={() => setMode('register')}
              >
                Register New Account
              </button>
            </div>

            {mode === 'signin' ? (
              <>
                <div className="login-card-head">
                  <div className="login-badge-tag">
                    <Sparkles size={14} />
                    <span>OFFICIAL PORTAL ACCESS</span>
                  </div>
                  <h2>Sign in to console</h2>
                  <p>Enter your municipal credentials or select a verified quick-access role.</p>
                </div>

                {/* Demo Quick Roles Selector */}
                <div className="demo-roles-container">
                  <div className="demo-roles-label">
                    <span>Select Quick Demo Profile:</span>
                  </div>
                  <div className="demo-roles-grid">
                    {DEMO_ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole.email === role.email;
                      return (
                        <button
                          key={role.email}
                          type="button"
                          className={`demo-role-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => handleSelectRole(role)}
                        >
                          <div className="demo-role-icon">
                            <Icon size={16} />
                          </div>
                          <div className="demo-role-info">
                            <span className="role-title">{role.title}</span>
                            <small className="role-name">{role.name}</small>
                          </div>
                          {isSelected && <span className="role-check">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sign In Form */}
                <form onSubmit={handleSignIn} className="login-form">
                  <div className="form-group">
                    <label htmlFor="login-email">Official Email / Municipal ID</label>
                    <div className="input-with-icon">
                      <Mail size={17} className="input-icon" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="officer@city.gov.in"
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="label-with-link">
                      <label htmlFor="login-password">Security Password</label>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => setShowForgotModal(true)}
                      >
                        Forgot key?
                      </button>
                    </div>
                    <div className="input-with-icon">
                      <Lock size={17} className="input-icon" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span>Keep session authenticated on this workstation</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="primary login-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading">
                        <span className="loading-spinner" /> Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Workspace</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <div className="login-divider">
                    <span>OR</span>
                  </div>

                  <button
                    type="button"
                    className="secondary guest-btn"
                    onClick={handleGuestAccess}
                  >
                    Continue as Guest Observer (Read-Only)
                  </button>

                  <div className="auth-switch-link">
                    <span>New officer or researcher? </span>
                    <button type="button" onClick={() => setMode('register')}>
                      Create an account →
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="login-card-head">
                  <div className="login-badge-tag">
                    <UserCheck size={14} />
                    <span>NEW MUNICIPAL ACCOUNT</span>
                  </div>
                  <h2>Register officer profile</h2>
                  <p>Create credentials to participate in climate tracking and resilience planning.</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleRegister} className="login-form">
                  <div className="form-group">
                    <label htmlFor="reg-name">Full Name</label>
                    <div className="input-with-icon">
                      <User size={17} className="input-icon" />
                      <input
                        id="reg-name"
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Dr. Ramesh Kumar"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-email">Official / Work Email</label>
                    <div className="input-with-icon">
                      <Mail size={17} className="input-icon" />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="ramesh.k@city.gov.in"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="reg-dept">Department</label>
                      <div className="input-with-icon">
                        <Building2 size={16} className="input-icon" />
                        <select
                          id="reg-dept"
                          value={regDept}
                          onChange={(e) => setRegDept(e.target.value)}
                        >
                          <option>Urban Planning Directorate</option>
                          <option>Atmospheric & GIS Modeling</option>
                          <option>Field Sensor Operations</option>
                          <option>Disaster & Heat Mitigation</option>
                          <option>Civic Climate Research</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="reg-role">Designation</label>
                      <div className="input-with-icon">
                        <Briefcase size={16} className="input-icon" />
                        <select
                          id="reg-role"
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value)}
                        >
                          <option>City Planner</option>
                          <option>Climate & GIS Analyst</option>
                          <option>IoT Sensor Specialist</option>
                          <option>Environmental Officer</option>
                          <option>Municipal Administrator</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-password">Password (min. 6 characters)</label>
                    <div className="input-with-icon">
                      <Lock size={17} className="input-icon" />
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Create strong password"
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="reg-confirm">Confirm Password</label>
                    <div className="input-with-icon">
                      <Lock size={17} className="input-icon" />
                      <input
                        id="reg-confirm"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                      />
                    </div>
                  </div>

                  <div className="form-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={regAgree}
                        onChange={(e) => setRegAgree(e.target.checked)}
                      />
                      <span>I agree to uphold the Urban Climate Intelligence Data Governance Policy</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="primary login-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading">
                        <span className="loading-spinner" /> Creating Profile...
                      </span>
                    ) : (
                      <>
                        <span>Register & Enter Console</span>
                        <ArrowRight size={17} />
                      </>
                    )}
                  </button>

                  <div className="auth-switch-link">
                    <span>Already registered? </span>
                    <button type="button" onClick={() => setMode('signin')}>
                      Sign in here →
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="login-security-notice">
              <ShieldCheck size={16} />
              <span>
                Authorized municipal personnel only. All access is logged and
                audited under the Urban Climate Intelligence Framework.
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Forgot Credentials Modal */}
      {showForgotModal && (
        <Modal
          title="Account Recovery & Credentials"
          subtitle="Municipal IT & Identity Service"
          onClose={() => setShowForgotModal(false)}
        >
          <div className="forgot-modal-content">
            <div className="forgot-icon-wrap">
              <Info size={32} />
            </div>
            <p>
              For security compliance, automated password resets are governed by
              the <b>Metropolitan Disaster Management & GIS Directorate</b>.
            </p>
            <div className="condition-grid">
              <div>
                <small>Internal Helpdesk</small>
                <b>ext. 4402 / 4409</b>
              </div>
              <div>
                <small>Secure Escalation</small>
                <b>it-sec@city.gov.in</b>
              </div>
            </div>
            <p className="forgot-hint">
              Tip: You can use any of the preset <b>Quick Demo Profiles</b> on
              the sign-in screen for instant access to the platform without manual reset.
            </p>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="primary"
              onClick={() => setShowForgotModal(false)}
            >
              Back to Sign In
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
