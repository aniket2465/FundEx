import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Activity, ArrowDownRight, ArrowUpRight, Bell, ChevronDown, CircleHelp, Command, LayoutDashboard, LogOut, Menu, Search, Settings2, ShieldCheck, TrendingUp, Wallet, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Brand({ light = false, to = '/' }) {
  return <Link to={to} className={`brand ${light ? 'brand-light' : ''}`} aria-label="FundEx home">
    <span className="brand-symbol"><img src="/fundex-mark.png" alt="" aria-hidden="true"/></span>
    <span className="brand-wordmark"><span>Fund</span><span className="brand-accent">Ex</span><small>INVEST WITH CLARITY</small></span>
  </Link>;
}

export function Button({ children, variant = 'primary', size = '', className = '', ...props }) {
  return <button className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`} {...props}>{children}</button>;
}

export function PageHeader({ eyebrow, title, subtitle, action }) {
  return <div className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}

export function Spinner({ label = 'Loading your data…' }) {
  return <div className="loading-state"><span className="spinner"/><span>{label}</span></div>;
}

export function EmptyState({ icon: Icon = Activity, title, description, action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={22}/></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function ErrorNotice({ message, onRetry }) {
  return <div className="error-notice"><span>{message}</span>{onRetry && <button onClick={onRetry}>Try again</button>}</div>;
}

export function StatCard({ label, value, note, tone = 'default', icon: Icon, trend }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span>{Icon && <span className={`stat-icon ${tone}`}><Icon size={17}/></span>}</div><div className="stat-value">{value}</div><div className={`stat-note ${tone}`}>{trend === 'up' ? <ArrowUpRight size={14}/> : trend === 'down' ? <ArrowDownRight size={14}/> : null}{note}</div></div>;
}

export function StatusPill({ children, tone = 'neutral' }) { return <span className={`status-pill ${tone}`}>{children}</span>; }

export function Money({ value, compact = false, sign = false }) {
  const number = Number(value ?? 0);
  const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, notation: compact ? 'compact' : 'standard' }).format(Number.isFinite(number) ? number : 0);
  return <>{sign && number > 0 ? '+' : ''}{formatted}</>;
}

export function Change({ value }) {
  const n = Number(value ?? 0);
  return <span className={`change ${n >= 0 ? 'positive' : 'negative'}`}>{n >= 0 ? '+' : ''}{n.toFixed(2)}%</span>;
}

const userLinks = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/stocks', label: 'Explore stocks', icon: TrendingUp },
  { to: '/app/watchlist', label: 'My watchlist', icon: Activity },
  { to: '/app/portfolio', label: 'My portfolio', icon: Command },
  { to: '/app/holdings', label: 'My holdings', icon: ShieldCheck },
  { to: '/app/wallet', label: 'Virtual wallet', icon: Wallet },
  { to: '/app/transactions', label: 'Transactions', icon: Settings2 },
];
const adminLinks = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/stocks', label: 'Stock catalog', icon: TrendingUp },
  { to: '/admin/stocks/new', label: 'Create stock', icon: Activity },
];

export function AppShell({ children, admin = false }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const links = admin ? adminLinks : userLinks;
  const initials = (user?.fullName || user?.email || 'F').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  const signOut = () => { logout(); navigate('/login', { replace: true }); };

  return <div className="app-shell">
    {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)}/>}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand"><Brand to={admin ? "/admin" : "/app"}/></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-bottom">
        <div className="help-card"><span className="help-icon"><CircleHelp size={17}/></span><strong>Need a hand?</strong><p>Explore your virtual investing workspace.</p></div>
        <div className="sidebar-disclaimer">Virtual trading only. No real orders are placed.</div>
      </div>
    </aside>
    <div className="main-area">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={20}/></button>
        <div className="breadcrumb"><span>FundEx</span><span className="breadcrumb-slash">/</span><strong>{admin ? 'Admin workspace' : 'Investor workspace'}</strong></div>
        <div className="topbar-right">
          <span className="market-indicator"><span className="live-dot"/> SIMULATED MARKET</span>
          <button className="icon-button notification-button" title="Notifications are not enabled"><Bell size={18}/></button>
          <div className="profile-wrap">
            <button className="profile-trigger" onClick={() => setProfileOpen(!profileOpen)}><span className="avatar">{initials}</span><span className="profile-copy"><strong>{user?.fullName || 'FundEx user'}</strong><small>{admin ? 'Administrator' : 'Investor'}</small></span><ChevronDown size={15}/></button>
            {profileOpen && <div className="profile-menu"><div className="profile-menu-head"><strong>{user?.fullName}</strong><small>{user?.email}</small></div><button onClick={signOut}><LogOut size={16}/> Sign out</button></div>}
          </div>
        </div>
      </header>
      <main className="content-area">{children}</main>
      <footer className="app-footer"><span>© {new Date().getFullYear()} FundEx</span><span>Educational platform · Simulated market data · Not investment advice</span></footer>
    </div>
  </div>;
}

export function PublicNav() {
  return <header className="public-nav"><Brand/><nav><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#about">About</a></nav><div className="public-nav-actions"><Link to="/login" className="nav-login">Log in</Link><Link to="/register" className="btn btn-primary btn-small">Get started</Link></div></header>;
}

export function Toast({ toast, onClose }) {
  if (!toast) return null;
  return <div className={`toast toast-${toast.type || 'success'}`} role="status"><span>{toast.message}</span><button onClick={onClose} aria-label="Dismiss"><X size={16}/></button></div>;
}
