import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '../services/api';

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(payload).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join('')));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fundex_token'));
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(Boolean(localStorage.getItem('fundex_token')));

  const loadUser = useCallback(async (activeToken) => {
    if (!activeToken) { setUser(null); setInitializing(false); return; }
    const claims = decodeJwt(activeToken);
    try {
      const response = await endpoints.me();
      setUser({ ...response.data, role: claims?.role || 'USER' });
    } catch {
      localStorage.removeItem('fundex_token');
      setToken(null);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => { loadUser(token); }, [token, loadUser]);

  useEffect(() => {
    const logoutOnUnauthorized = () => { setToken(null); setUser(null); };
    window.addEventListener('fundex:unauthorized', logoutOnUnauthorized);
    return () => window.removeEventListener('fundex:unauthorized', logoutOnUnauthorized);
  }, []);

  const login = async (email, password) => {
    const response = await endpoints.login({ email, password });
    const nextToken = response.data?.token;
    if (!nextToken) throw new Error('The server did not return an authentication token.');
    localStorage.setItem('fundex_token', nextToken);
    setToken(nextToken);
    const claims = decodeJwt(nextToken);
    const me = await endpoints.me();
    const nextUser = { ...me.data, role: claims?.role || 'USER' };
    setUser(nextUser);
    setInitializing(false);
    return nextUser;
  };

  const register = (payload) => endpoints.register(payload);
  const logout = () => {
    localStorage.removeItem('fundex_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, initializing, login, register, logout }), [token, user, initializing]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

export function RedirectByRole() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { navigate(user?.role === 'ADMIN' ? '/admin' : '/app', { replace: true }); }, [user, navigate]);
  return null;
}
