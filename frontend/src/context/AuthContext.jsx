import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));

  const signIn = (adminData, jwtToken) => {
    localStorage.setItem('admin_token', jwtToken);
    localStorage.setItem('admin_user', JSON.stringify(adminData));
    setToken(jwtToken);
    setAdmin(adminData);
  };

  const signOut = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = Boolean(token && admin);

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
