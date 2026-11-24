import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Activity, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Bookmark, BriefcaseBusiness, Building2, Check, ChevronRight, CircleDollarSign, Clock3, Eye, EyeOff, Filter, Landmark, LineChart, LockKeyhole, LogOut, Plus, Search, ShieldCheck, ShoppingBag, Sparkles, Star, TrendingDown, TrendingUp, WalletCards, X } from 'lucide-react';
import { endpoints, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AllocationChart, HistoryChart } from '../components/Charts';
import { AppShell, Brand, Button, Change, EmptyState, ErrorNotice, Money, PageHeader, Spinner, StatCard, StatusPill } from '../components/UI';
import StockTicker from '../components/StockTicker';

function useToast() {
  const [toast, setToast] = useState(null);
  const show = (message, type = 'success') => { setToast({ message, type }); window.setTimeout(() => setToast(null), 3600); };
  return { toast, show, clear: () => setToast(null) };
}

function Field({ label, error, ...props }) {
  return <label className="field"><span>{label}</span><input {...props}/>{error && <small className="field-error">{error}</small>}</label>;
}

function AuthFrame({ children, title, subtitle, footer }) {
  return <div className="auth-page"><div className="auth-left"><Brand/><div className="auth-pitch"><div className="eyebrow light-eyebrow">YOUR FINANCIAL PRACTICE SPACE</div><h1>Build confidence<br/>before the market.</h1><p>Explore stocks, practice virtual investing, and understand your portfolio with FundEx.</p><div className="auth-mini-stats"><div><strong>₹1,00,000</strong><span>Virtual starting capital</span></div><div><strong>100%</strong><span>Practice environment</span></div></div></div><div className="auth-left-foot">Virtual trading only · No real money involved</div></div><div className="auth-right"><div className="auth-mobile-brand"><Brand/></div><div className="auth-form-wrap"><div className="auth-form-heading"><h2>{title}</h2><p>{subtitle}</p></div>{children}{footer}</div><div className="auth-copyright">© {new Date().getFullYear()} FundEx. All rights reserved.</div></div></div>;
}

export function LandingPage() {
  return <div className="landing"><PublicLandingNav/><section className="hero"><div className="hero-copy"><div className="hero-kicker"><span className="live-dot"/> A smarter way to practice investing</div><h1>Invest smarter.<br/><span>Track better.</span><br/>Grow confident.</h1><p>Explore the Indian stock market, practice virtual trades, and understand your portfolio — all in one focused workspace.</p><div className="hero-actions"><Link className="btn btn-primary btn-large" to="/register">Start exploring <ArrowRight size={17}/></Link><a className="btn btn-secondary btn-large" href="#features">Discover FundEx</a></div><div className="hero-trust"><span><ShieldCheck size={15}/> Risk-free virtual trading</span><span><Activity size={15}/> Simulated market data</span></div></div><div className="hero-visual"><div className="hero-glow"/><div className="preview-window"><div className="preview-top"><div className="window-dots"><i/><i/><i/></div><span>FUNDEX / OVERVIEW</span><span className="preview-live"><i/> SIMULATED</span></div><div className="preview-body"><div className="preview-welcome"><div><small>PORTFOLIO OVERVIEW</small><h3>Your investments, in focus.</h3></div><span className="preview-avatar">A</span></div><div className="preview-value-card"><small>PORTFOLIO VALUE</small><strong>₹1,24,850.00</strong><span><ArrowUpRight size={13}/> +8.24% <em>illustrative preview</em></span><div className="preview-line"><svg viewBox="0 0 440 90" preserveAspectRatio="none"><path d="M0 74 C28 70 32 50 62 58 S95 73 121 48 S153 57 181 39 S215 47 246 29 S277 43 307 24 S340 38 365 14 S402 29 440 4" fill="none" stroke="#29b68d" strokeWidth="3" strokeLinecap="round"/><path d="M0 74 C28 70 32 50 62 58 S95 73 121 48 S153 57 181 39 S215 47 246 29 S277 43 307 24 S340 38 365 14 S402 29 440 4 L440 90 L0 90Z" fill="url(#previewGradient)"/><defs><linearGradient id="previewGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#29b68d" stopOpacity=".2"/><stop offset="1" stopColor="#29b68d" stopOpacity="0"/></linearGradient></defs></svg></div></div><div className="preview-metrics"><div><small>INVESTED</small><strong>₹1,10,000</strong></div><div><small>UNREALIZED P&amp;L</small><strong className="text-green">+₹14,850</strong></div></div><div className="preview-table"><div className="preview-table-head"><span>WATCHLIST</span><span>SIMULATED PRICE</span></div>{[['RELIANCE','Reliance Industries','₹1,420.50','+1.8%'],['INFY','Infosys','₹1,680.25','+0.9%'],['TCS','Tata Consultancy','₹3,850.00','−0.4%']].map((r) => <div className="preview-stock" key={r[0]}><span className="stock-mini-logo">{r[0].slice(0,1)}</span><span className="preview-stock-name"><b>{r[0]}</b><small>{r[1]}</small></span><strong>{r[2]}</strong><em className={r[3].startsWith('+') ? 'text-green' : 'text-red'}>{r[3]}</em></div>)}</div></div></div><div className="floating-note"><span><Sparkles size={15}/></span><div><strong>Practice with purpose</strong><small>Learn from every virtual trade</small></div></div></div></section><section className="trust-strip"><span>BUILT FOR LEARNING</span><div><ShieldCheck size={17}/> Virtual-first experience</div><div><BarChart3 size={17}/> Portfolio insights</div><div><LockKeyhole size={17}/> Secure account access</div></section><section className="section-block" id="features"><div className="section-heading"><div className="eyebrow">THE FUNDEX EXPERIENCE</div><h2>Everything you need to<br/><span>learn the market.</span></h2><p>A connected workspace to explore, practice, and review your investing decisions.</p></div><div className="feature-grid"><Feature icon={TrendingUp} number="01" title="Explore stocks" text="Browse your stock catalog, search companies, and study simulated price movements."/><Feature icon={Bookmark} number="02" title="Build a watchlist" text="Keep the stocks you care about close and follow their simulated prices."/><Feature icon={WalletCards} number="03" title="Practice trading" text="Make virtual BUY and SELL decisions with your ₹1,00,000 starting wallet."/><Feature icon={LineChart} number="04" title="Understand your portfolio" text="Review holdings, allocation, and realized or unrealized profit and loss."/></div></section><section className="how-section" id="how-it-works"><div className="how-copy"><div className="eyebrow">A SIMPLE WORKFLOW</div><h2>Learn by doing.<br/><span>Improve with insight.</span></h2><p>FundEx gives you a structured environment to understand how stock selection, trade execution, and portfolio decisions work together.</p><Link to="/register" className="text-link">Create your free practice account <ArrowRight size={16}/></Link></div><div className="steps-list"><Step n="01" title="Create your account" text="Register securely and receive your virtual starting balance."/><Step n="02" title="Explore and shortlist" text="Discover stocks, inspect charts, and add companies to your watchlist."/><Step n="03" title="Make virtual trades" text="Practice buying and selling while tracking your wallet and holdings."/><Step n="04" title="Review your decisions" text="Use portfolio insights to understand your investment outcomes."/></div></section><section className="cta-section" id="about"><div><div className="eyebrow light-eyebrow">YOUR NEXT STEP STARTS HERE</div><h2>Make your market learning<br/>more meaningful.</h2><p>Build your virtual portfolio with FundEx — one thoughtful decision at a time.</p></div><Link to="/register" className="btn btn-white btn-large">Get started <ArrowRight size={17}/></Link></section><footer className="public-footer"><Brand/><span>FundEx is an educational virtual trading platform. Market prices and historical series are simulated and do not represent live exchange data. Not investment advice.</span><small>© {new Date().getFullYear()} FundEx</small></footer></div>;
}

function PublicLandingNav() { return <header className="public-nav"><Brand/><nav><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#about">About</a></nav><div className="public-nav-actions"><Link to="/login" className="nav-login">Log in</Link><Link to="/register" className="btn btn-primary btn-small">Get started</Link></div></header>; }
function Feature({ icon: Icon, number, title, text }) { return <div className="feature-card"><div className="feature-card-top"><span className="feature-icon"><Icon size={21}/></span><small>{number}</small></div><h3>{title}</h3><p>{text}</p><span className="feature-arrow"><ArrowUpRight size={18}/></span></div>; }
function Step({ n, title, text }) { return <div className="step-row"><span className="step-number">{n}</span><div><h3>{title}</h3><p>{text}</p></div><ChevronRight size={18}/></div>; }

export function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const submit = async (event) => { event.preventDefault(); setError(''); setBusy(true); try { const user = await login(email.trim(), password); navigate(user.role === 'ADMIN' ? '/admin' : '/app', { replace: true }); } catch (e) { setError(getErrorMessage(e, 'Unable to sign in. Check your credentials.')); } finally { setBusy(false); } };
  return <AuthFrame title="Welcome back" subtitle="Sign in to continue to your FundEx workspace." footer={<p className="auth-switch">New to FundEx? <Link to="/register">Create an account</Link></p>}><form className="auth-form" onSubmit={submit}>{error && <div className="form-alert">{error}</div>}<Field label="Email address" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}/><label className="field"><span>Password</span><div className="password-wrap"><input type={show ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}/><button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility">{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label><Button type="submit" className="btn-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={16}/></Button><div className="auth-secure"><LockKeyhole size={14}/> Your account is protected with secure authentication.</div></form></AuthFrame>;
}

export function RegisterPage() {
  const { register } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' }); const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const submit = async (event) => { event.preventDefault(); setError(''); setSuccess(''); if (form.password.length < 8) return setError('Password must contain at least 8 characters.'); if (form.password !== form.confirmPassword) return setError('Passwords do not match.'); setBusy(true); try { await register({ fullName: form.fullName.trim(), email: form.email.trim(), password: form.password }); setSuccess('Your account has been created. Please sign in.'); setTimeout(() => navigate('/login', { replace: true, state: { email: form.email } }), 900); } catch (e) { setError(getErrorMessage(e, 'Unable to create your account.')); } finally { setBusy(false); } };
  return <AuthFrame title="Create your account" subtitle="Start exploring the market in a virtual environment." footer={<p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>}><form className="auth-form" onSubmit={submit}>{error && <div className="form-alert">{error}</div>}{success && <div className="form-success">{success}</div>}<Field label="Full name" placeholder="Your full name" autoComplete="name" required maxLength={100} value={form.fullName} onChange={update('fullName')}/><Field label="Email address" type="email" placeholder="you@example.com" autoComplete="email" required value={form.email} onChange={update('email')}/><label className="field"><span>Password</span><div className="password-wrap"><input type={show ? 'text' : 'password'} placeholder="At least 8 characters" autoComplete="new-password" required minLength={8} maxLength={72} value={form.password} onChange={update('password')}/><button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility">{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label><Field label="Confirm password" type="password" placeholder="Re-enter your password" autoComplete="new-password" required value={form.confirmPassword} onChange={update('confirmPassword')}/><Button type="submit" className="btn-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <ArrowRight size={16}/></Button><div className="auth-secure"><LockKeyhole size={14}/> New accounts receive the USER role and ₹1,00,000 virtual wallet.</div></form></AuthFrame>;
}

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [prices, setPrices] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(null);

  const refreshPrices = useCallback(async (stockList) => {
    if (!stockList.length) return;
    const results = await Promise.allSettled(stockList.map((stock) => endpoints.livePrice(stock.symbol)));
    setPrices((previous) => {
      const next = { ...previous };
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') next[stockList[index].symbol] = result.value.data;
      });
      return next;
    });
    setLastRefresh(new Date());
  }, []);

  const loadHome = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled([
      endpoints.stocks(), endpoints.wallet(), endpoints.portfolioSummary(),
      endpoints.holdings(), endpoints.watchlist()
    ]);
    const failed = results.filter((result) => result.status === 'rejected').length;
    if (results[0].status === 'fulfilled') {
      const stockList = results[0].value.data || [];
      setStocks(stockList);
      await refreshPrices(stockList);
    } else {
      setError(getErrorMessage(results[0].reason, 'Unable to load the stock catalog.'));
    }
    if (results[1].status === 'fulfilled') setWallet(results[1].value.data);
    if (results[2].status === 'fulfilled') setSummary(results[2].value.data);
    if (results[3].status === 'fulfilled') setHoldings(results[3].value.data || []);
    if (results[4].status === 'fulfilled') setWatchlist(results[4].value.data || []);
    if (failed === results.length) setError('FundEx could not load your market workspace. Check that the backend is running.');
    setLoading(false);
  }, [refreshPrices]);

  useEffect(() => { loadHome(); }, [loadHome]);
  useEffect(() => {
    if (!stocks.length) return undefined;
    const timer = window.setInterval(() => refreshPrices(stocks), 10000);
    return () => window.clearInterval(timer);
  }, [stocks, refreshPrices]);

  const watchSymbols = useMemo(() => new Set(watchlist.map((item) => item.symbol)), [watchlist]);
  const sectors = useMemo(() => {
    const counts = {};
    stocks.forEach((stock) => {
      const sector = stock.sector || 'Other';
      counts[sector] = (counts[sector] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [stocks]);
  const filteredStocks = useMemo(() => stocks.filter((stock) => {
    const matchesQuery = `${stock.symbol} ${stock.companyName} ${stock.sector || ''}`.toLowerCase().includes(query.toLowerCase());
    const matchesExchange = activeFilter === 'ALL' || (activeFilter === 'WATCHLIST' ? watchSymbols.has(stock.symbol) : stock.exchange?.toUpperCase() === activeFilter);
    return matchesQuery && matchesExchange;
  }).sort((a, b) => a.symbol.localeCompare(b.symbol)), [stocks, query, activeFilter, watchSymbols]);
  const signOut = () => { logout(); navigate('/login', { replace: true }); };
  const displayName = (user?.fullName || user?.email || 'Investor').split(' ')[0];

  if (loading) return <div className="market-home-loading"><Spinner label="Preparing your market workspace…"/></div>;

  return <div className="market-home">
    <header className="market-home-nav">
      <div className="market-home-nav-inner">
        <Brand to="/app"/>
        <nav className="market-main-links">
          <Link className="active" to="/app">Home</Link>
          <Link to="/app/stocks">Stocks</Link>
          <Link to="/app/watchlist">Watchlist</Link>
          <Link to="/app/portfolio">Portfolio</Link>
        </nav>
        <div className="market-nav-actions">
          <Link to="/app/wallet" className="nav-wallet"><WalletCards size={16}/><span><small>Virtual cash</small><strong><Money value={wallet?.balance}/></strong></span></Link>
          <div className="market-user-menu"><span className="market-user-avatar">{displayName.slice(0, 1).toUpperCase()}</span><span className="market-user-name">{displayName}</span><button title="Sign out" onClick={signOut}><LogOut size={16}/></button></div>
        </div>
      </div>
    </header>

    <div className="market-status-bar">
      <div className="market-status-inner"><span className="market-status-live"><i/> SIMULATED MARKET</span><span>FundEx stock universe <b>{stocks.length} stocks</b></span><span>Prices refresh automatically</span><span className="market-status-time">{lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Waiting for prices'}</span></div>
    </div>

    <StockTicker stocks={stocks} prices={prices}/>

    <main className="market-home-content">
      <section className="market-welcome-row">
        <div><div className="market-eyebrow">YOUR MARKET WORKSPACE</div><h1>Good morning, {displayName} <span>👋</span></h1><p>Explore companies, follow simulated prices, and make informed virtual trading decisions.</p></div>
        <div className="market-practice-pill"><ShieldCheck size={16}/> Virtual trading · No real orders</div>
      </section>

      <section className="market-search-hero">
        <div className="market-search-copy"><span>DISCOVER YOUR NEXT IDEA</span><h2>Find stocks worth<br/>keeping an eye on.</h2><p>Search your FundEx stock catalog by company, symbol, or sector.</p></div>
        <div className="market-search-box"><Search size={20}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stocks, companies or sectors…" aria-label="Search stocks"/><kbd>⌘ K</kbd><button onClick={() => navigate('/app/stocks')}>Advanced search <ArrowRight size={15}/></button></div>
        <div className="market-search-decoration"><span>F</span><i/><i/><i/></div>
      </section>

      {error && <ErrorNotice message={error} onRetry={loadHome}/>}

      <section className="market-quick-stats">
        <div className="market-quick-stat"><span className="market-stat-icon blue"><Building2 size={18}/></span><div><small>Stocks available</small><strong>{stocks.length}</strong></div><span className="market-stat-caption">In your catalog</span></div>
        <div className="market-quick-stat"><span className="market-stat-icon violet"><Bookmark size={18}/></span><div><small>Your watchlist</small><strong>{watchlist.length}</strong></div><Link to="/app/watchlist">View list <ArrowUpRight size={13}/></Link></div>
        <div className="market-quick-stat"><span className="market-stat-icon green"><BriefcaseBusiness size={18}/></span><div><small>Open positions</small><strong>{holdings.length}</strong></div><Link to="/app/holdings">View holdings <ArrowUpRight size={13}/></Link></div>
        <div className="market-quick-stat"><span className="market-stat-icon amber"><WalletCards size={18}/></span><div><small>Portfolio value</small><strong><Money value={summary?.currentPortfolioValue}/></strong></div><Link to="/app/portfolio">View portfolio <ArrowUpRight size={13}/></Link></div>
      </section>

      <section className="market-home-grid">
        <div className="market-primary-column">
          <section className="market-section-card">
            <div className="market-section-heading"><div><div className="market-eyebrow">EXPLORE THE CATALOG</div><h2>Stocks in focus</h2><p>Browse the companies available in your virtual market.</p></div><Link to="/app/stocks" className="market-view-all">View all stocks <ArrowRight size={15}/></Link></div>
            <div className="market-filter-row">{[['ALL', 'All stocks'], ['NSE', 'NSE'], ['BSE', 'BSE'], ['WATCHLIST', 'My watchlist']].map(([key, label]) => <button key={key} className={activeFilter === key ? 'selected' : ''} onClick={() => setActiveFilter(key)}>{label}{key === 'WATCHLIST' && <span>{watchlist.length}</span>}</button>)}</div>
            <div className="market-stock-table-wrap"><table className="market-stock-table"><thead><tr><th>COMPANY</th><th>EXCHANGE</th><th>SECTOR</th><th>SIMULATED PRICE</th><th>LAST UPDATED</th><th/></tr></thead><tbody>{filteredStocks.slice(0, 9).map((stock) => <tr key={stock.id}><td><Link to={`/app/stocks/${stock.symbol}`} className="market-company-link"><span className="market-company-avatar">{stock.symbol.slice(0, 1)}</span><span><b>{stock.companyName}</b><small>{stock.symbol}</small></span></Link></td><td><span className="market-exchange-tag">{stock.exchange}</span></td><td className="market-muted-cell">{stock.sector || '—'}</td><td className="market-price-cell">{prices[stock.symbol] ? <Money value={prices[stock.symbol].currentPrice}/> : '—'}</td><td className="market-muted-cell">{prices[stock.symbol]?.lastUpdated ? new Date(prices[stock.symbol].lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td><td><Link to={`/app/stocks/${stock.symbol}`} className="market-row-arrow"><ArrowUpRight size={16}/></Link></td></tr>)}</tbody></table>{!filteredStocks.length && <EmptyState icon={Search} title="No matching stocks" description="Try another search or switch the market filter."/>}</div>
            {filteredStocks.length > 9 && <div className="market-table-footer"><span>Showing 9 of {filteredStocks.length} stocks</span><Link to="/app/stocks">Explore complete catalog <ArrowRight size={14}/></Link></div>}
          </section>

          <section className="market-section-card sector-section">
            <div className="market-section-heading"><div><div className="market-eyebrow">BROWSE BY INDUSTRY</div><h2>Explore sectors</h2><p>See how your stock catalog is distributed across sectors.</p></div></div>
            <div className="market-sector-grid">{sectors.map(([sector, count], index) => <button key={sector} className="market-sector-card" onClick={() => { setQuery(sector === 'Other' ? '' : sector); setActiveFilter('ALL'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><span className={`market-sector-icon sector-${index}`}><BarChart3 size={17}/></span><span><b>{sector}</b><small>{count} {count === 1 ? 'stock' : 'stocks'}</small></span><ArrowUpRight size={15}/></button>)}</div>
            {!sectors.length && <EmptyState icon={BarChart3} title="Sector data not available" description="Sector categories will appear when stocks are added to the catalog."/>}
          </section>
        </div>

        <aside className="market-side-column">
          <section className="market-portfolio-card"><div className="market-portfolio-card-top"><span>YOUR VIRTUAL PORTFOLIO</span><span className="market-mini-live"><i/> ACTIVE</span></div><small>Current portfolio value</small><strong className="market-portfolio-value"><Money value={summary?.currentPortfolioValue}/></strong><div className={`market-pnl ${Number(summary?.totalProfitLoss || 0) >= 0 ? 'positive' : 'negative'}`}>{Number(summary?.totalProfitLoss || 0) >= 0 ? '+' : ''}<Money value={summary?.totalProfitLoss}/> <span>total P&amp;L</span></div><div className="market-portfolio-divider"/><div className="market-portfolio-line"><span>Invested</span><b><Money value={summary?.totalInvested}/></b></div><div className="market-portfolio-line"><span>Virtual cash</span><b><Money value={wallet?.balance}/></b></div><Link to="/app/portfolio" className="market-portfolio-button">Open portfolio <ArrowRight size={15}/></Link></section>

          <section className="market-section-card market-watch-card"><div className="market-side-heading"><div><div className="market-eyebrow">SAVED FOR LATER</div><h2>Your watchlist</h2></div><Link to="/app/watchlist" aria-label="View watchlist"><ArrowUpRight size={16}/></Link></div>{watchlist.length ? watchlist.slice(0, 5).map((item) => <Link to={`/app/stocks/${item.symbol}`} className="market-watch-row" key={item.id}><span className="market-company-avatar small">{item.symbol.slice(0, 1)}</span><span><b>{item.symbol}</b><small>{item.companyName}</small></span><strong><Money value={prices[item.symbol]?.currentPrice ?? item.currentPrice}/></strong></Link>) : <div className="market-watch-empty"><Bookmark size={20}/><p>Your watchlist is empty.</p><Link to="/app/stocks">Discover stocks <ArrowRight size={13}/></Link></div>}</section>

          <section className="market-learning-card"><span><Activity size={17}/></span><div><b>Practice with purpose</b><p>FundEx uses simulated market prices so you can explore trading concepts without risking real money.</p><Link to="/app/stocks">Explore stocks <ArrowRight size={13}/></Link></div></section>
        </aside>
      </section>
      <footer className="market-home-footer"><span>© {new Date().getFullYear()} FundEx</span><span>All prices and historical series are simulated for educational use and are not live exchange quotes.</span></footer>
    </main>
  </div>;
}

export function StocksPage() {
  const [stocks, setStocks] = useState([]); const [prices, setPrices] = useState({}); const [query, setQuery] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [adding, setAdding] = useState(''); const { show, toast, clear } = useToast();
  const refreshPrices = useCallback(async (stockList) => {
    if (!stockList.length) return;
    const priceResults = await Promise.allSettled(
      stockList.map((stock) => endpoints.livePrice(stock.symbol))
    );
    setPrices((previous) => {
      const next = { ...previous };
      priceResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          next[stockList[index].symbol] = result.value.data;
        }
      });
      return next;
    });
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await endpoints.stocks();
      const list = response.data || [];
      setStocks(list);
      await refreshPrices(list);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [refreshPrices]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!stocks.length) return undefined;
    const intervalId = window.setInterval(() => refreshPrices(stocks), 10000);
    return () => window.clearInterval(intervalId);
  }, [stocks, refreshPrices]);
  const filtered = stocks.filter((stock) => `${stock.symbol} ${stock.companyName} ${stock.sector || ''}`.toLowerCase().includes(query.toLowerCase()));
  const add = async (symbol) => { setAdding(symbol); try { await endpoints.addWatchlist(symbol); show(`${symbol} added to your watchlist.`); } catch (e) { show(getErrorMessage(e), 'error'); } finally { setAdding(''); } };
  return <AppShell><PageHeader eyebrow="MARKET EXPLORER" title="Explore stocks" subtitle="Discover companies in your FundEx stock catalog and study simulated prices." action={<span className="market-chip"><span className="live-dot"/> Simulated prices</span>}/><div className="toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by symbol, company, or sector…"/><kbd>⌘ K</kbd></div><span className="result-count">{filtered.length} stocks</span></div>{loading ? <Spinner label="Loading stock catalog…"/> : error ? <ErrorNotice message={error} onRetry={load}/> : <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Company</th><th>Exchange</th><th>Sector</th><th>Simulated price</th><th>Updated</th><th></th></tr></thead><tbody>{filtered.map((stock) => <tr key={stock.id}><td><Link to={`/app/stocks/${stock.symbol}`} className="company-cell"><span className="company-logo">{stock.symbol.slice(0, 1)}</span><span><strong>{stock.companyName}</strong><small>{stock.symbol}</small></span></Link></td><td><StatusPill>{stock.exchange}</StatusPill></td><td className="muted-cell">{stock.sector || '—'}</td><td className="price-cell">{prices[stock.symbol] ? <Money value={prices[stock.symbol].currentPrice}/> : '—'}</td><td className="muted-cell">{prices[stock.symbol]?.lastUpdated ? new Date(prices[stock.symbol].lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td><td><div className="row-actions"><Link to={`/app/stocks/${stock.symbol}`} className="table-link">Details <ArrowRight size={14}/></Link><button className="icon-button table-icon" title="Add to watchlist" disabled={adding === stock.symbol} onClick={() => add(stock.symbol)}><Plus size={16}/></button></div></td></tr>)}</tbody></table>{!filtered.length && <EmptyState icon={Search} title="No stocks found" description="Try a different company name or symbol."/>}</div></div>}<div className="data-disclaimer"><Activity size={14}/> All prices and historical series displayed in FundEx are simulated for educational use and are not live exchange quotes.</div><ToastInline toast={toast} clear={clear}/></AppShell>;
}

export function StockDetailPage() {
  const { symbol } = useParams(); const [stock, setStock] = useState(null); const [price, setPrice] = useState(null); const [history, setHistory] = useState([]); const [watchlist, setWatchlist] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [trade, setTrade] = useState(null); const [quantity, setQuantity] = useState(1); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [messageType, setMessageType] = useState('success');
  const load = useCallback(async () => { setLoading(true); setError(''); try { const results = await Promise.all([endpoints.stock(symbol), endpoints.livePrice(symbol), endpoints.history(symbol), endpoints.watchlist()]); setStock(results[0].data); setPrice(results[1].data); setHistory(results[2].data || []); setWatchlist(results[3].data || []); } catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); } }, [symbol]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const intervalId = window.setInterval(async () => {
      try {
        const response = await endpoints.livePrice(symbol);
        setPrice(response.data);
      } catch (error) {
        // Keep the last known price visible if a background refresh fails.
      }
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [symbol]);
  const isSaved = watchlist.some((item) => item.symbol === symbol);
  const toggleWatchlist = async () => { try { if (isSaved) { await endpoints.removeWatchlist(symbol); setWatchlist((old) => old.filter((item) => item.symbol !== symbol)); setMessage('Removed from your watchlist.'); } else { await endpoints.addWatchlist(symbol); setWatchlist((old) => [...old, { symbol }]); setMessage('Added to your watchlist.'); } setMessageType('success'); } catch (e) { setMessage(getErrorMessage(e)); setMessageType('error'); } };
  const submitTrade = async (event) => { event.preventDefault(); setBusy(true); setMessage(''); try { if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) throw new Error('Enter a quantity of at least 1 share.'); if (trade === 'BUY') await endpoints.buy(symbol, Number(quantity)); else await endpoints.sell(symbol, Number(quantity)); setMessage(`${trade === 'BUY' ? 'Purchase' : 'Sale'} completed successfully.`); setMessageType('success'); setTrade(null); setQuantity(1); await load(); } catch (e) { setMessage(getErrorMessage(e)); setMessageType('error'); } finally { setBusy(false); } };
  if (loading) return <AppShell><Spinner label={`Loading ${symbol}…`}/></AppShell>;
  if (error) return <AppShell><ErrorNotice message={error} onRetry={load}/><Link to="/app/stocks" className="text-link"><ArrowLeft size={15}/> Back to stocks</Link></AppShell>;
  return <AppShell><div className="back-row"><Link to="/app/stocks"><ArrowLeft size={15}/> Back to explore stocks</Link><span className="market-chip"><span className="live-dot"/> Simulated market</span></div><div className="stock-detail-head"><div className="stock-detail-identity"><span className="company-logo large">{stock.symbol.slice(0, 1)}</span><div><div className="eyebrow">{stock.exchange} · {stock.sector || 'Listed company'}</div><h1>{stock.companyName}</h1><p>{stock.symbol} <span className="dot-separator">·</span> {stock.active ? 'Active listing' : 'Inactive listing'}</p></div></div><div className="stock-detail-price"><strong><Money value={price?.currentPrice}/></strong><small>Simulated current price</small><span>Updated {price?.lastUpdated ? new Date(price.lastUpdated).toLocaleString('en-IN') : '—'}</span></div></div>{message && <div className={messageType === 'error' ? 'form-alert' : 'form-success'}>{message}</div>}<div className="stock-detail-grid"><section className="panel stock-chart-panel"><div className="panel-heading"><div><h2>Price history</h2><p>Historical simulated closing prices</p></div><StatusPill tone="info">Synthetic data</StatusPill></div><HistoryChart data={history}/><div className="ohlc-row">{history.length ? ['open','high','low','close'].map((key) => <div key={key}><small>{key.toUpperCase()}</small><strong><Money value={history[history.length - 1][key]}/></strong></div>) : <span>No OHLC information available.</span>}</div></section><section className="panel trade-panel"><div className="panel-heading"><div><h2>Trade {stock.symbol}</h2><p>Practice with virtual money</p></div><span className="trade-badge">VIRTUAL</span></div><p className="trade-explainer">Choose an action to open a trade ticket. Your backend validates the wallet balance and share quantity.</p><Button className="btn-full" onClick={() => { setTrade('BUY'); setMessage(''); }}> <ArrowUpRight size={17}/> Buy shares</Button><Button variant="outline" className="btn-full" onClick={() => { setTrade('SELL'); setMessage(''); }}><ArrowDownRight size={17}/> Sell shares</Button><button className={`watchlist-toggle ${isSaved ? 'saved' : ''}`} onClick={toggleWatchlist}>{isSaved ? <Check size={16}/> : <Plus size={16}/>} {isSaved ? 'In your watchlist' : 'Add to watchlist'}</button><div className="trade-note"><ShieldCheck size={15}/> Virtual trades only. No real orders are placed.</div></section></div>{trade && <div className="modal-backdrop" onClick={() => !busy && setTrade(null)}><div className="modal-card" onClick={(e) => e.stopPropagation()}><div className="modal-head"><div><div className="eyebrow">VIRTUAL ORDER</div><h2>{trade === 'BUY' ? 'Buy' : 'Sell'} {symbol}</h2></div><button className="icon-button" onClick={() => setTrade(null)} disabled={busy}><X size={18}/></button></div><form onSubmit={submitTrade}><div className="order-price"><span>Current simulated price</span><strong><Money value={price?.currentPrice}/></strong></div><Field label="Quantity (shares)" type="number" min="1" step="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)}/><div className="order-total"><span>Estimated value</span><strong><Money value={Number(price?.currentPrice || 0) * Number(quantity || 0)}/></strong></div><p className="modal-hint">Final execution price is determined by the backend at the time of the trade.</p>{message && <div className="form-alert">{message}</div>}<Button type="submit" className="btn-full" disabled={busy}>{busy ? 'Processing…' : `Confirm ${trade.toLowerCase()}`}</Button></form></div></div>}</AppShell>;
}

export function WatchlistPage() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [removing, setRemoving] = useState('');
  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await endpoints.watchlist();
      setRows(response.data || []);
      setError('');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const intervalId = window.setInterval(() => load(false), 5000);
    return () => window.clearInterval(intervalId);
  }, [load]);
  const remove = async (symbol) => { setRemoving(symbol); try { await endpoints.removeWatchlist(symbol); setRows((old) => old.filter((row) => row.symbol !== symbol)); } catch (e) { setError(getErrorMessage(e)); } finally { setRemoving(''); } };
  return <AppShell><PageHeader eyebrow="YOUR SHORTLIST" title="My watchlist" subtitle="Keep track of the companies you want to follow." action={<Link to="/app/stocks" className="btn btn-primary"><Plus size={16}/> Explore stocks</Link>}/>{loading ? <Spinner/> : error ? <ErrorNotice message={error} onRetry={load}/> : rows.length ? <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Company</th><th>Simulated price</th><th>Added on</th><th></th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><Link to={`/app/stocks/${row.symbol}`} className="company-cell"><span className="company-logo">{row.symbol.slice(0, 1)}</span><span><strong>{row.companyName}</strong><small>{row.symbol}</small></span></Link></td><td className="price-cell"><Money value={row.currentPrice}/></td><td className="muted-cell">{row.addedAt ? new Date(row.addedAt).toLocaleDateString('en-IN') : '—'}</td><td><div className="row-actions"><Link className="table-link" to={`/app/stocks/${row.symbol}`}>View <ArrowRight size={14}/></Link><button className="text-danger" disabled={removing === row.symbol} onClick={() => remove(row.symbol)}>Remove</button></div></td></tr>)}</tbody></table></div></div> : <EmptyState icon={Bookmark} title="Your watchlist is waiting" description="Save stocks from the explorer to keep them close." action={<Link to="/app/stocks" className="btn btn-primary">Explore stocks <ArrowRight size={16}/></Link>}/>}</AppShell>;
}

export function WalletPage() {
  const [wallet, setWallet] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); try { const response = await endpoints.wallet(); setWallet(response.data); setError(''); } catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  return <AppShell><PageHeader eyebrow="VIRTUAL FUNDS" title="Your wallet" subtitle="A clear view of the virtual cash available for your practice trades."/>{loading ? <Spinner/> : error ? <ErrorNotice message={error} onRetry={load}/> : <><div className="wallet-hero"><div className="wallet-hero-top"><span className="wallet-card-label"><WalletCards size={17}/> FUNDEX VIRTUAL WALLET</span><span className="wallet-chip">PRACTICE ACCOUNT</span></div><div className="wallet-balance-label">Available virtual balance</div><div className="wallet-balance"><Money value={wallet?.balance}/></div><div className="wallet-card-bottom"><div><small>ACCOUNT CREATED</small><strong>{wallet?.createdAt ? new Date(wallet.createdAt).toLocaleDateString('en-IN') : '—'}</strong></div><div className="wallet-symbol">₹</div></div><div className="wallet-orb orb-one"/><div className="wallet-orb orb-two"/></div><div className="wallet-info-grid"><div className="panel info-panel"><span className="info-icon green"><Check size={18}/></span><h3>Virtual capital</h3><p>Every new FundEx user starts with ₹1,00,000 in virtual funds to practice buying and selling stocks.</p></div><div className="panel info-panel"><span className="info-icon blue"><ShieldCheck size={18}/></span><h3>Safe practice environment</h3><p>Your wallet balance is managed by the backend and changes only when virtual trades are completed.</p></div></div><div className="data-disclaimer"><Activity size={14}/> FundEx does not support real deposits, withdrawals, payments, or exchange execution.</div></>}</AppShell>;
}

export function HoldingsPage() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await endpoints.holdings();
      setRows(response.data || []);
      setError('');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const intervalId = window.setInterval(() => load(false), 5000);
    return () => window.clearInterval(intervalId);
  }, [load]);
  const total = rows.reduce((sum, row) => sum + Number(row.investmentValue || 0), 0);
  return <AppShell><PageHeader eyebrow="YOUR POSITIONS" title="My holdings" subtitle="Review the shares you currently own and their simulated market value." action={<Link to="/app/stocks" className="btn btn-primary"><Plus size={16}/> Find stocks</Link>}/>{loading ? <Spinner/> : error ? <ErrorNotice message={error} onRetry={load}/> : <><div className="holdings-summary"><div><small>Current holdings value</small><strong><Money value={total}/></strong></div><div><small>Open positions</small><strong>{rows.length}</strong></div></div>{rows.length ? <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Stock</th><th>Quantity</th><th>Average buy price</th><th>Current price</th><th>Current value</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><Link to={`/app/stocks/${row.symbol}`} className="company-cell"><span className="company-logo">{row.symbol.slice(0, 1)}</span><span><strong>{row.companyName}</strong><small>{row.symbol}</small></span></Link></td><td>{row.quantity}</td><td><Money value={row.averageBuyPrice}/></td><td><Money value={row.currentPrice}/></td><td className="price-cell"><Money value={row.investmentValue}/></td><td><div className="row-actions"><Link to={`/app/stocks/${row.symbol}`} className="table-link">Trade <ArrowRight size={14}/></Link></div></td></tr>)}</tbody></table></div></div> : <EmptyState icon={BarChart3} title="No holdings yet" description="Your open positions will appear here after your first virtual BUY trade." action={<Link to="/app/stocks" className="btn btn-primary">Explore stocks <ArrowRight size={16}/></Link>}/>}</>}</AppShell>;
}

export function TransactionsPage() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [filter, setFilter] = useState('ALL'); const [query, setQuery] = useState('');
  const load = useCallback(async () => { setLoading(true); try { const response = await endpoints.transactions(); setRows(response.data || []); setError(''); } catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const filtered = rows.filter((row) => (filter === 'ALL' || row.transactionType === filter) && `${row.symbol} ${row.transactionType}`.toLowerCase().includes(query.toLowerCase()));
  return <AppShell><PageHeader eyebrow="ACTIVITY LOG" title="Transactions" subtitle="A complete record of your virtual BUY and SELL activity."/><div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Search stock symbol…" value={query} onChange={(e) => setQuery(e.target.value)}/></div><div className="filter-tabs">{['ALL','BUY','SELL'].map((item) => <button key={item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item === 'ALL' ? 'All trades' : item}</button>)}</div></div>{loading ? <Spinner/> : error ? <ErrorNotice message={error} onRetry={load}/> : filtered.length ? <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Stock</th><th>Type</th><th>Quantity</th><th>Execution price</th><th>Total amount</th><th>Date & time</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><td><Link to={`/app/stocks/${row.symbol}`} className="company-cell compact-company"><span className="company-logo">{row.symbol.slice(0, 1)}</span><strong>{row.symbol}</strong></Link></td><td><StatusPill tone={row.transactionType === 'BUY' ? 'positive' : 'negative'}>{row.transactionType}</StatusPill></td><td>{row.quantity}</td><td><Money value={row.price}/></td><td className="price-cell"><Money value={row.totalAmount}/></td><td className="muted-cell">{row.transactionDate ? new Date(row.transactionDate).toLocaleString('en-IN') : '—'}</td></tr>)}</tbody></table></div></div> : <EmptyState icon={Activity} title="No matching transactions" description="Trades will appear here after you complete virtual BUY or SELL orders."/>}</AppShell>;
}

export function PortfolioPage() {
  const [summary, setSummary] = useState(null); const [allocation, setAllocation] = useState([]); const [holdings, setHoldings] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const results = await Promise.all([endpoints.portfolioSummary(), endpoints.portfolioAllocation(), endpoints.holdings()]);
      setSummary(results[0].data);
      setAllocation(results[1].data || []);
      setHoldings(results[2].data || []);
      setError('');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const intervalId = window.setInterval(() => load(false), 10000);
    return () => window.clearInterval(intervalId);
  }, [load]);
  const profit = Number(summary?.totalProfitLoss || 0);
  return <AppShell><PageHeader eyebrow="PERFORMANCE OVERVIEW" title="My portfolio" subtitle="Understand your current positions and portfolio allocation." action={<span className="market-chip">Virtual portfolio</span>}/>{loading ? <Spinner/> : error ? <ErrorNotice message={error} onRetry={load}/> : <><div className="portfolio-hero"><div><span className="portfolio-hero-label">CURRENT PORTFOLIO VALUE</span><strong><Money value={summary?.currentPortfolioValue}/></strong><span className={`portfolio-return ${profit >= 0 ? 'positive' : 'negative'}`}>{profit >= 0 ? '+' : ''}<Money value={profit}/> total P&amp;L</span></div><div className="portfolio-hero-side"><span>Total invested</span><strong><Money value={summary?.totalInvested}/></strong><span>Across {holdings.length} open positions</span></div></div><div className="stat-grid stat-grid-four"><StatCard label="Total invested" value={<Money value={summary?.totalInvested}/>} note="Current holdings cost" icon={CircleDollarSign}/><StatCard label="Unrealized P&L" value={<Money value={summary?.unrealizedProfitLoss}/>} note="Open positions" tone={Number(summary?.unrealizedProfitLoss) >= 0 ? 'positive' : 'negative'} icon={TrendingUp}/><StatCard label="Realized P&L" value={<Money value={summary?.realizedProfitLoss}/>} note="Completed sell trades" tone={Number(summary?.realizedProfitLoss) >= 0 ? 'positive' : 'negative'} icon={Activity}/><StatCard label="Total P&L" value={<Money value={summary?.totalProfitLoss}/>} note="Realized + unrealized" tone={profit >= 0 ? 'positive' : 'negative'} icon={BarChart3}/></div><div className="dashboard-grid portfolio-grid"><section className="panel"><div className="panel-heading"><div><h2>Asset allocation</h2><p>Share of current portfolio value</p></div></div><AllocationChart data={allocation}/></section><section className="panel"><div className="panel-heading"><div><h2>Position breakdown</h2><p>Current value by stock</p></div></div>{holdings.length ? <div className="position-list">{holdings.map((item) => <div className="position-row" key={item.id}><span className="company-logo">{item.symbol.slice(0,1)}</span><div className="position-name"><strong>{item.symbol}</strong><small>{item.quantity} shares · Avg. <Money value={item.averageBuyPrice}/></small></div><strong><Money value={item.investmentValue}/></strong></div>)}</div> : <div className="chart-empty">Your positions will appear here after your first trade.</div>}</section></div><div className="data-disclaimer"><Activity size={14}/> Portfolio values use simulated market prices. This view is educational and not a statement from a broker or exchange.</div></>}</AppShell>;
}

export function AdminDashboardPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [analyticsRetry, setAnalyticsRetry] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await endpoints.stocks();
      const stockList = response.data || [];
      setStocks(stockList);
      setSelectedSymbol((current) => current || stockList.find((stock) => stock.active)?.symbol || stockList[0]?.symbol || '');
      setError('');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!selectedSymbol) {
      setAnalytics(null);
      return;
    }
    let cancelled = false;
    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError('');
      try {
        const response = await endpoints.stockTradingActivity(selectedSymbol);
        if (!cancelled) setAnalytics(response.data);
      } catch (e) {
        if (!cancelled) {
          setAnalytics(null);
          setAnalyticsError(getErrorMessage(e, 'Unable to load trading activity for this stock.'));
        }
      } finally {
        if (!cancelled) setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
    return () => { cancelled = true; };
  }, [selectedSymbol, analyticsRetry]);

  const percent = (value) => `${Number(value || 0).toFixed(2)}%`;
  return <AppShell admin><PageHeader eyebrow="ADMIN WORKSPACE" title="Catalog overview" subtitle="Manage the shared stock catalog used across FundEx." action={<Link to="/admin/stocks/new" className="btn btn-primary"><Plus size={16}/> Create stock</Link>}/>{loading ? <Spinner/> : error ? <ErrorNotice message={error} onRetry={load}/> : <><div className="admin-welcome"><div className="admin-welcome-icon"><ShieldCheck size={24}/></div><div><strong>Administrator access enabled</strong><p>You can create stocks for the shared FundEx catalog. Market series and live prices are generated by the backend.</p></div><StatusPill tone="info">ADMIN</StatusPill></div><div className="stat-grid stat-grid-three"><StatCard label="Catalog stocks" value={stocks.length} note="Available in the platform" icon={TrendingUp}/><StatCard label="Active listings" value={stocks.filter((s) => s.active).length} note="Marked active" icon={Check}/><StatCard label="Exchanges" value={new Set(stocks.map((s) => s.exchange)).size} note="Represented in catalog" icon={Landmark}/></div>
      <section className="panel admin-analytics-panel">
        <div className="panel-heading admin-analytics-heading"><div><h2>Stock trading activity</h2><p>Review virtual BUY and SELL activity for an individual stock.</p></div><label className="admin-stock-select"><span>Select stock</span><select value={selectedSymbol} onChange={(event) => setSelectedSymbol(event.target.value)} disabled={!stocks.length}><option value="" disabled>Select a stock</option>{stocks.map((stock) => <option key={stock.id} value={stock.symbol}>{stock.symbol} — {stock.companyName}</option>)}</select></label></div>
        {analyticsLoading ? <Spinner label="Loading stock trading activity…"/> : analyticsError ? <ErrorNotice message={analyticsError} onRetry={() => setAnalyticsRetry((value) => value + 1)}/> : analytics ? <>
          <div className="admin-analytics-stats">
            <StatCard label="Unique buyers" value={analytics.uniqueBuyers} note="Distinct investor accounts" icon={Activity}/>
            <StatCard label="Unique sellers" value={analytics.uniqueSellers} note="Distinct investor accounts" icon={Activity}/>
            <StatCard label="BUY transactions" value={analytics.buyTransactions} note="Number of buy orders recorded" tone="positive" icon={TrendingUp}/>
            <StatCard label="SELL transactions" value={analytics.sellTransactions} note="Number of sell orders recorded" tone="negative" icon={TrendingDown}/>
          </div>
          <div className="admin-analytics-breakdown">
            <div className="analytics-breakdown-card"><div className="analytics-breakdown-title"><strong>Transaction share</strong><span>Based on number of transactions</span></div><div className="analytics-share-row"><span>BUY</span><strong>{percent(analytics.buyTransactionPercentage)}</strong></div><div className="analytics-share-track"><span className="buy-fill" style={{ width: `${Math.min(100, Math.max(0, Number(analytics.buyTransactionPercentage) || 0))}%` }}/></div><div className="analytics-share-row"><span>SELL</span><strong>{percent(analytics.sellTransactionPercentage)}</strong></div><div className="analytics-share-track"><span className="sell-fill" style={{ width: `${Math.min(100, Math.max(0, Number(analytics.sellTransactionPercentage) || 0))}%` }}/></div></div>
            <div className="analytics-breakdown-card"><div className="analytics-breakdown-title"><strong>Share quantity</strong><span>Total virtual shares traded by direction</span></div><div className="analytics-quantity-grid"><div><span>BUY quantity</span><strong>{Number(analytics.buyQuantity || 0).toLocaleString('en-IN')}</strong><small>{percent(analytics.buyQuantityPercentage)}</small></div><div><span>SELL quantity</span><strong>{Number(analytics.sellQuantity || 0).toLocaleString('en-IN')}</strong><small>{percent(analytics.sellQuantityPercentage)}</small></div></div></div>
          </div>
        </> : <div className="chart-empty">{stocks.length ? 'Select a stock to view its trading activity.' : 'Add a stock to the catalog before viewing trading activity.'}</div>}
        <div className="admin-analytics-disclaimer">These figures reflect FundEx virtual transactions only. Unique buyers and sellers are counted separately; an investor who has both bought and sold may appear in both counts.</div>
      </section>
      <div className="panel table-panel"><div className="panel-heading panel-heading-padded"><div><h2>Recently available stocks</h2><p>Latest entries from the stock catalog</p></div><Link to="/admin/stocks" className="subtle-link">Manage catalog <ArrowRight size={14}/></Link></div><div className="table-scroll"><table><thead><tr><th>Company</th><th>Exchange</th><th>Sector</th><th>Status</th></tr></thead><tbody>{stocks.slice(-6).reverse().map((stock) => <tr key={stock.id}><td><span className="company-cell"><span className="company-logo">{stock.symbol.slice(0,1)}</span><span><strong>{stock.companyName}</strong><small>{stock.symbol}</small></span></span></td><td><StatusPill>{stock.exchange}</StatusPill></td><td className="muted-cell">{stock.sector || '—'}</td><td><StatusPill tone={stock.active ? 'positive' : 'neutral'}>{stock.active ? 'Active' : 'Inactive'}</StatusPill></td></tr>)}</tbody></table></div></div></>}</AppShell>;
}

export function AdminStocksPage() {
  const [stocks, setStocks] = useState([]); const [query, setQuery] = useState(''); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); try { const response = await endpoints.stocks(); setStocks(response.data || []); setError(''); } catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const filtered = stocks.filter((s) => `${s.symbol} ${s.companyName} ${s.exchange}`.toLowerCase().includes(query.toLowerCase()));
  return <AppShell admin><PageHeader eyebrow="CATALOG MANAGEMENT" title="Stock catalog" subtitle="Review the shared stocks available to FundEx users." action={<Link to="/admin/stocks/new" className="btn btn-primary"><Plus size={16}/> Add stock</Link>}/><div className="toolbar"><div className="search-box"><Search size={18}/><input placeholder="Search catalog…" value={query} onChange={(e) => setQuery(e.target.value)}/></div><span className="result-count">{filtered.length} stocks</span></div>{loading ? <Spinner/> : error ? <ErrorNotice message={error} onRetry={load}/> : <div className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Company</th><th>Exchange</th><th>Sector</th><th>Status</th></tr></thead><tbody>{filtered.map((stock) => <tr key={stock.id}><td><span className="company-cell"><span className="company-logo">{stock.symbol.slice(0,1)}</span><span><strong>{stock.companyName}</strong><small>{stock.symbol}</small></span></span></td><td><StatusPill>{stock.exchange}</StatusPill></td><td className="muted-cell">{stock.sector || '—'}</td><td><StatusPill tone={stock.active ? 'positive' : 'neutral'}>{stock.active ? 'Active' : 'Inactive'}</StatusPill></td></tr>)}</tbody></table></div></div>}</AppShell>;
}

export function CreateStockPage() {
  const navigate = useNavigate(); const [form, setForm] = useState({ symbol: '', companyName: '', exchange: 'NSE', sector: '', startingPrice: '' }); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [success, setSuccess] = useState('');
  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const submit = async (event) => { event.preventDefault(); setError(''); setSuccess(''); if (Number(form.startingPrice) <= 0) return setError('Starting price must be greater than zero.'); setBusy(true); try { await endpoints.createStock({ symbol: form.symbol.trim().toUpperCase(), companyName: form.companyName.trim(), exchange: form.exchange, sector: form.sector.trim() || null, startingPrice: Number(form.startingPrice) }); setSuccess('Stock created. The backend will generate its synthetic history and initialize the simulated live price.'); setTimeout(() => navigate('/admin/stocks'), 1400); } catch (e) { setError(getErrorMessage(e, 'Unable to create stock.')); } finally { setBusy(false); } };
  return <AppShell admin><div className="back-row"><Link to="/admin/stocks"><ArrowLeft size={15}/> Back to stock catalog</Link><StatusPill tone="info">ADMIN ONLY</StatusPill></div><PageHeader eyebrow="CATALOG MANAGEMENT" title="Create a stock" subtitle="Add a company to the shared FundEx catalog."/><div className="create-stock-layout"><section className="panel form-panel"><div className="panel-heading"><div><h2>Stock information</h2><p>Enter the details used to identify this listing.</p></div></div>{error && <div className="form-alert">{error}</div>}{success && <div className="form-success">{success}</div>}<form className="stacked-form" onSubmit={submit}><Field label="Stock symbol" placeholder="e.g. RELIANCE" required maxLength={20} value={form.symbol} onChange={update('symbol')}/><Field label="Company name" placeholder="e.g. Reliance Industries Limited" required maxLength={150} value={form.companyName} onChange={update('companyName')}/><div className="form-two-col"><label className="field"><span>Exchange</span><select value={form.exchange} onChange={update('exchange')}><option value="NSE">NSE</option><option value="BSE">BSE</option></select></label><Field label="Sector (optional)" placeholder="e.g. Energy" maxLength={100} value={form.sector} onChange={update('sector')}/></div><Field label="Starting reference price (₹)" type="number" min="0.01" step="0.01" placeholder="e.g. 1250.00" required value={form.startingPrice} onChange={update('startingPrice')}/><div className="form-info"><Activity size={16}/><span>The starting reference price is used by the backend to generate synthetic historical data and initialize a simulated live price. It is not a real market quote.</span></div><div className="form-actions"><Button type="button" variant="outline" onClick={() => navigate('/admin/stocks')}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Create stock'} <ArrowRight size={16}/></Button></div></form></section><aside className="panel side-info-panel"><span className="info-icon blue"><ShieldCheck size={18}/></span><h3>Shared catalog</h3><p>Stocks added here become visible to all FundEx users. Customers can browse and trade virtually, but cannot create or modify catalog entries.</p><div className="side-info-line"><Check size={15}/> Admin-only backend permission</div><div className="side-info-line"><Check size={15}/> Synthetic history generated by backend</div><div className="side-info-line"><Check size={15}/> Shared simulated live price</div></aside></div></AppShell>;
}

function WatchlistTable({ rows }) {
  if (!rows.length) return <div className="compact-empty">Your saved stocks will appear here. <Link to="/app/stocks">Explore stocks <ArrowRight size={13}/></Link></div>;
  return <div className="mini-list">{rows.map((row) => <div className="mini-row" key={row.id}><span className="company-logo small">{row.symbol.slice(0,1)}</span><span className="mini-row-name"><strong>{row.symbol}</strong><small>{row.companyName}</small></span><strong><Money value={row.currentPrice}/></strong><Link to={`/app/stocks/${row.symbol}`} className="mini-arrow"><ChevronRight size={16}/></Link></div>)}</div>;
}
function TransactionList({ rows }) {
  if (!rows.length) return <div className="compact-empty">Your completed trades will appear here. <Link to="/app/stocks">Explore stocks <ArrowRight size={13}/></Link></div>;
  return <div className="mini-list">{rows.map((row) => <div className="mini-row" key={row.id}><span className={`transaction-icon ${row.transactionType === 'BUY' ? 'buy' : 'sell'}`}>{row.transactionType === 'BUY' ? <ArrowDownRight size={16}/> : <ArrowUpRight size={16}/>}</span><span className="mini-row-name"><strong>{row.transactionType} {row.symbol}</strong><small>{row.quantity} shares · {row.transactionDate ? new Date(row.transactionDate).toLocaleDateString('en-IN') : ''}</small></span><strong><Money value={row.totalAmount}/></strong></div>)}</div>;
}
function ToastInline({ toast, clear }) { return toast ? <div className={`inline-toast ${toast.type === 'error' ? 'error' : ''}`}>{toast.message}<button onClick={clear}><X size={14}/></button></div> : null; }
