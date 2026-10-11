import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('college_event_user') || sessionStorage.getItem('college_event_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify session on mount with backend
    api.get('/auth/me')
      .then(userData => {
        setUser(userData);
        localStorage.setItem('college_event_user', JSON.stringify(userData));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('college_event_user');
        sessionStorage.removeItem('college_event_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, remember = true) => {
    const res = await api.post('/auth/login', { email, password });
    if (res && res.user) {
      setUser(res.user);
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('college_event_user', JSON.stringify(res.user));
      return res.user;
    }
  };

  const register = async (fullName, email, password, role) => {
    const res = await api.post('/auth/register', { fullName, email, password, role });
    if (res && res.user) {
      setUser(res.user);
      localStorage.setItem('college_event_user', JSON.stringify(res.user));
      return res.user;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout error', e);
    }
    setUser(null);
    localStorage.removeItem('college_event_user');
    sessionStorage.removeItem('college_event_user');
  };

  const updateProfile = async (data) => {
    const updated = await api.put('/auth/profile', data);
    setUser(updated);
    localStorage.setItem('college_event_user', JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
