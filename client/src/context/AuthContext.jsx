import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api'; // Assuming you have an api service

// ✅ Named export - THIS IS CRITICAL
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const setAuthData = useCallback((userData, token) => {
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, []);

  const clearAuthData = useCallback(() => {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      delete api.defaults.headers.common['Authorization'];
  }, []);

  const checkAuthStatus = useCallback(async () => {
      const token = localStorage.getItem('token');
      if (token) {
          try {
              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              const res = await api.get('/auth/me');
              const userData = res.data.data;
              setUser(userData);
              setIsAuthenticated(true);
              // Handle redirection after refresh or direct access if onboarding is not complete
              handlePostAuthRedirect(userData, location.pathname);
          } catch (error) {
              console.error('Failed to fetch user data:', error);
              clearAuthData();
              navigate('/login');
          }
      }
      setLoading(false);
  }, [clearAuthData, navigate, location.pathname]);

  useEffect(() => {
      checkAuthStatus();
  }, [checkAuthStatus]);

  const handlePostAuthRedirect = useCallback((userData, currentPath) => {
    const isOnboardingPath = ['/role-selection', '/onboarding/teacher', '/onboarding/admin'].includes(currentPath);
    const isDashboardPath = currentPath.startsWith('/dashboard') || currentPath.startsWith('/teacher') || currentPath.startsWith('/admin');

      if (!userData.onboardingCompleted) {
      // Enforce onboarding for users who haven't completed it
      if (!userData.role && currentPath !== '/role-selection') {
        navigate('/role-selection');
      } else if (userData.role === 'teacher' && currentPath !== '/onboarding/teacher') {
        navigate('/onboarding/teacher');
      } else if (userData.role === 'admin' && currentPath !== '/onboarding/admin') {
        navigate('/onboarding/admin');
      } else if (userData.role === 'student' && !isOnboardingPath && !isDashboardPath) {
        // Fallback for students if they land on public pages while logged in
        navigate('/dashboard/student');
      }
      } else {
      // If onboarding is completed, prevent access to onboarding or login pages
      if (isOnboardingPath || currentPath === '/login' || currentPath === '/register') {
        if (userData.role === 'student') {
          navigate('/dashboard/student');
          } else if (userData.role === 'teacher') {
              navigate('/dashboard/teacher');
          } else if (userData.role === 'admin') {
              navigate('/dashboard/admin');
          } else {
              // Fallback for users with no role or unexpected role
              navigate('/home');
          }
      }
    }
  }, [navigate]);

  const login = async (email, password) => {
      try {
          const res = await api.post('/auth/login', { email, password });
          setAuthData(res.data.data, res.data.token);
          handlePostAuthRedirect(res.data.data, location.pathname);
          return { success: true };
      } catch (error) {
          console.error('Login failed:', error.response?.data?.message || error.message);
          return { success: false, message: error.response?.data?.message || 'Login failed' };
      }
  };

  const register = async (name, email, password, role = 'student') => {
      try {
          const res = await api.post('/auth/register', { name, email, password, role });
          setAuthData(res.data.data, res.data.token);
          handlePostAuthRedirect(res.data.data, location.pathname);
          return { success: true };
      } catch (error) {
          console.error('Registration failed:', error.response?.data?.message || error.message);
          return { success: false, message: error.response?.data?.message || 'Registration failed' };
      }
  };

  const logout = () => {
      clearAuthData();
      navigate('/login');
  };

  const updateProfile = async (profileData) => {
      try {
          const res = await api.put('/auth/profile', profileData);
          const updatedUser = res.data.user;
          setUser(updatedUser);
          // After profile update, re-evaluate redirection if onboarding status changed
          handlePostAuthRedirect(updatedUser, location.pathname);
          return { success: true, user: updatedUser };
      } catch (error) {
          console.error('Profile update failed:', error.response?.data?.message || error.message);
          return { success: false, message: error.response?.data?.message || 'Profile update failed' };
      }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};