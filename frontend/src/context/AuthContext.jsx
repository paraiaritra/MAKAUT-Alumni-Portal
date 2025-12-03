import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on startup
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authAPI.getCurrentUser();
          setUser(data);
        } catch (error) {
          console.error("Token invalid or expired");
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Login Function
  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  // Register Function
  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // NEW: Function to refresh user data without reloading page
  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getCurrentUser();
      setUser(data); // This updates the UI instantly
    } catch (error) {
      console.error("Failed to refresh user data");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};