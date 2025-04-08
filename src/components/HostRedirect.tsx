import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HostRedirectProps {
  children: React.ReactNode;
}

const HostRedirect: React.FC<HostRedirectProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is a host, redirect to host page
    if (user && user.userType === 'host') {
      navigate('/host');
    }
  }, [user, navigate]);

  // If no user or not a host, render children (regular content)
  return <>{children}</>;
};

export default HostRedirect; 