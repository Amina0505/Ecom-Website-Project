import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('userToken') || localStorage.getItem('token');
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    const checkUserPermissions = async () => {
      // For admin routes
      if (requireAdmin || location.pathname.startsWith('/admin')) {
        setHasAccess(!!adminToken);
        setLoading(false);
        return;
      }
      
      // For seller routes
      if (location.pathname.startsWith('/seller')) {
        if (!userToken) {
          setHasAccess(false);
          setLoading(false);
          return;
        }
        
        // If we already have the user object with role, use that
        if (user && user.role === 'seller') {
          setHasAccess(true);
          setLoading(false);
          return;
        }
        
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${userToken}` }
          });
          
          // Extract user data correctly with both possible response formats
          const userData = response.data.success && response.data.user 
            ? response.data.user 
            : (response.data.user || response.data);
            
          setHasAccess(userData.role === 'seller');
        } catch (error) {
          console.error('Error checking user role:', error);
          setHasAccess(false);
        }
        
        setLoading(false);
        return;
      }
      
      // For regular user routes
      setHasAccess(!!userToken);
      setLoading(false);
    };
    
    checkUserPermissions();
  }, [userToken, adminToken, location.pathname, requireAdmin, user]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Admin routes check for adminToken
  if (requireAdmin || location.pathname.startsWith('/admin')) {
    if (!hasAccess) {
      return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
  }
  
  // Seller routes check for userToken and seller role
  if (location.pathname.startsWith('/seller')) {
    if (!hasAccess) {
      // If they're logged in but not as a seller, redirect to profile with a message
      if (isAuthenticated) {
        return <Navigate to="/profile" replace state={{ sellerAccessDenied: true }} />;
      }
      return <Navigate to="/seller/login" replace />;
    }
    return <>{children}</>;
  }
  
  // Regular user routes check for userToken
  if (!hasAccess) {
    // Store the path they were trying to access
    sessionStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/" replace state={{ openAuthDialog: true }} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 