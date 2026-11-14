import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "../services/api";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    // After a page refresh, ask the server who the saved token belongs to.
    api
      .profile()
      .then((data) => setUser(data.user))
      .catch((err) => {
        // 401: the token is invalid or expired, so forget it.
        // Other errors (e.g. the server is offline) keep it for the next visit.
        if (err.status === 401) clearToken();
      })
      .finally(() => setLoading(false));
  }, []);
  // Called with the response of POST /auth/login or POST /auth/register.
  function signIn(data) {
    setToken(data.token);
    setUser(data.user);
  }
  function signOut() {
    clearToken();
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
