import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AuthRouteProps {
  children: React.ReactNode;
  hostOnly?: boolean;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, hostOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If host-only route but user is not a host
  if (hostOnly && user?.userType !== 'host') {
    return <Navigate to="/marketplace" replace />;
  }

  return <>{children}</>;
};

export default AuthRoute; 