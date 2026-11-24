import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fundex_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('fundex_token')) {
      localStorage.removeItem('fundex_token');
      window.dispatchEvent(new Event('fundex:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error?.response) return 'Cannot connect to FundEx server. Check that your backend is running.';
  return fallback;
}

export const endpoints = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload),
  me: () => api.get('/api/user/me'),
  stocks: () => api.get('/api/stocks'),
  stock: (symbol) => api.get(`/api/stocks/${encodeURIComponent(symbol)}`),
  searchStocks: (name) => api.get('/api/stocks/search', { params: { name } }),
  history: (symbol) => api.get(`/api/stocks/${encodeURIComponent(symbol)}/history`),
  livePrice: (symbol) => api.get(`/api/stocks/${encodeURIComponent(symbol)}/live-price`),
  createStock: (payload) => api.post('/api/stocks', payload),
  stockTradingActivity: (symbol) => api.get(`/api/admin/stocks/${encodeURIComponent(symbol)}/trading-activity`),
  watchlist: () => api.get('/api/watchlist'),
  addWatchlist: (symbol) => api.post(`/api/watchlist/${encodeURIComponent(symbol)}`),
  removeWatchlist: (symbol) => api.delete(`/api/watchlist/${encodeURIComponent(symbol)}`),
  wallet: () => api.get('/api/wallet'),
  holdings: () => api.get('/api/holdings'),
  transactions: () => api.get('/api/transactions'),
  buy: (symbol, quantity) => api.post(`/api/transactions/buy/${encodeURIComponent(symbol)}`, { quantity }),
  sell: (symbol, quantity) => api.post(`/api/transactions/sell/${encodeURIComponent(symbol)}`, { quantity }),
  portfolioSummary: () => api.get('/api/portfolio/summary'),
  portfolioAllocation: () => api.get('/api/portfolio/allocation'),
};

export default api;
