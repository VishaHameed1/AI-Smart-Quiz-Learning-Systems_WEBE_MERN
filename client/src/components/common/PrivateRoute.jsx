import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Define onboarding paths to avoid redirect loops
  const isOnboardingPath = [
    '/role-selection',
    '/onboarding/teacher',
    '/onboarding/admin'
  ].includes(location.pathname);

  // Redirect to onboarding if not completed
  if (!user?.onboardingCompleted && !isOnboardingPath) {
    if (!user?.role) return <Navigate to="/role-selection" replace />;
    if (user.role === 'teacher') return <Navigate to="/onboarding/teacher" replace />;
    if (user.role === 'admin') return <Navigate to="/onboarding/admin" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect unauthorized roles to their respective dashboards
    return <Navigate to={`/dashboard/${user?.role || 'student'}`} replace />;
  }

  return children;
};

export default PrivateRoute;
