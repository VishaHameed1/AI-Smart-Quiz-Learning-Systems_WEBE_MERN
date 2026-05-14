import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // User is authenticated but does not have the required role
    // Redirect to a general dashboard or an unauthorized page
    // For now, redirect to home or a generic dashboard
    console.warn(`Access denied for role: ${user?.role}. Required roles: ${allowedRoles.join(', ')}`);
    return <Navigate to="/dashboard" replace />; // Or a specific /unauthorized page
  }

  // User is authenticated and has an allowed role, render the children
  return children;
};

export default PrivateRoute;