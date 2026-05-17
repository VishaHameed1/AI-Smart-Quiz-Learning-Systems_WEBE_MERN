import React, { createContext, useState, useContext } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', userData.role);
  };
const register = async (payload) => {
  const data = await authService.register(payload);
  login(data.user, data.token);  // ✅ Already hai - yeh kaam karega
  return data;
};

  const performLogin = async (email, password) => {
    const data = await authService.login({ email, password });
    login(data.user, data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ user, token, login: performLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};