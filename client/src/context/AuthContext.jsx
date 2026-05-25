﻿import React, { createContext, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout, registerUser, updateUser, clearError } from '../store/slices/authSlice';

// ✅ Named export - THIS IS CRITICAL
export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // This error indicates AuthProvider is missing or misplaced
    console.error('useAuth must be used within an AuthProvider');
    // Fallback or throw, depending on desired behavior. Throwing is safer for development.
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    const performLogin = async (email, password, rememberMe) => {
      const resultAction = await dispatch(loginUser({ email, password, rememberMe }));
      if (loginUser.rejected.match(resultAction)) {
        throw resultAction.payload; // Re-throw error for component to catch
      }
      return resultAction.payload;
    };

    const performRegister = async (userData) => {
      const resultAction = await dispatch(registerUser(userData));
      if (registerUser.rejected.match(resultAction)) {
        throw resultAction.payload;
      }
      return resultAction.payload;
    };

    const performLogout = () => {
      dispatch(logout());
    };

    // This `updateProfile` is for local state update, not API call.
    // If you have an API call for profile update, it should be a thunk too.
    // For now, it just updates the Redux user object.
    const updateProfile = (profileData) => {
      dispatch(updateUser(profileData));
    };

    return {
      ...authState, // Expose all auth state from Redux
      login: performLogin,
      register: performRegister,
      logout: performLogout,
      updateProfile,
      clearAuthError: () => dispatch(clearError()),
    };
  }, [dispatch, authState]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};