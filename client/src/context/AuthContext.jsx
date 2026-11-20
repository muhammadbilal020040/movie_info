import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('mi_token'));
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem('mi_admin');
      return raw ? JSON.parse(raw) : null;
    } catch {
      localStorage.removeItem('mi_admin');
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/api/auth/me')
      .then((res) => {
        setAdmin(res.data.data);
        localStorage.setItem('mi_admin', JSON.stringify(res.data.data));
      })
      .catch(() => {
        localStorage.removeItem('mi_token');
        localStorage.removeItem('mi_admin');
        setToken(null);
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('mi_token', res.data.token);
    localStorage.setItem('mi_admin', JSON.stringify(res.data.admin));
    setToken(res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('mi_token');
    localStorage.removeItem('mi_admin');
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      token,
      admin,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, admin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
