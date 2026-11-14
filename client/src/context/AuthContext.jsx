import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api.me().then(data => setUser(data.user)).catch(() => localStorage.removeItem('promptvault_token')).finally(() => setLoading(false));
  }, []);
  function signIn(data) { localStorage.setItem('promptvault_token', data.token); setUser(data.user); }
  function signOut() { localStorage.removeItem('promptvault_token'); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
