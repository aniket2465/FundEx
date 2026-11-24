import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Spinner } from './components/UI';
import { AdminDashboardPage, AdminStocksPage, CreateStockPage, DashboardPage, HoldingsPage, LandingPage, LoginPage, PortfolioPage, RegisterPage, StockDetailPage, StocksPage, TransactionsPage, WalletPage, WatchlistPage } from './pages/Pages';

function Protected({ children, role }) {
  const { token, user, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return <div className="route-loading"><Spinner label="Securing your workspace…"/></div>;
  if (!token || !user) return <Navigate to="/login" replace state={{ from: location.pathname }}/>;
  if (role && user.role !== role) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/app'} replace/>;
  return children;
}

function PublicOnly({ children }) {
  const { token, user, initializing } = useAuth();
  if (initializing) return <div className="route-loading"><Spinner/></div>;
  if (token && user) return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/app'} replace/>;
  return children;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<LandingPage/>}/>
    <Route path="/login" element={<PublicOnly><LoginPage/></PublicOnly>}/>
    <Route path="/register" element={<PublicOnly><RegisterPage/></PublicOnly>}/>
    <Route path="/app" element={<Protected role="USER"><DashboardPage/></Protected>}/>
    <Route path="/app/stocks" element={<Protected role="USER"><StocksPage/></Protected>}/>
    <Route path="/app/stocks/:symbol" element={<Protected role="USER"><StockDetailPage/></Protected>}/>
    <Route path="/app/watchlist" element={<Protected role="USER"><WatchlistPage/></Protected>}/>
    <Route path="/app/wallet" element={<Protected role="USER"><WalletPage/></Protected>}/>
    <Route path="/app/holdings" element={<Protected role="USER"><HoldingsPage/></Protected>}/>
    <Route path="/app/transactions" element={<Protected role="USER"><TransactionsPage/></Protected>}/>
    <Route path="/app/portfolio" element={<Protected role="USER"><PortfolioPage/></Protected>}/>
    <Route path="/admin" element={<Protected role="ADMIN"><AdminDashboardPage/></Protected>}/>
    <Route path="/admin/stocks" element={<Protected role="ADMIN"><AdminStocksPage/></Protected>}/>
    <Route path="/admin/stocks/new" element={<Protected role="ADMIN"><CreateStockPage/></Protected>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
