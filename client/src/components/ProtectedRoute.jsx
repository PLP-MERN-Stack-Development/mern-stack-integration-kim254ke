import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // 1. Wait until authentication state is loaded from localStorage
  if (loading) {
    // A simple, visible loading state is better than a blank screen
    return <div className="text-center py-20 text-xl font-semibold text-blue-600">Loading user session...</div>;
  }

  // 2. Check if the user is authenticated
  if (!isAuthenticated) {
    // Redirect them to the login page if not logged in
    return <Navigate to="/login" replace />;
  }

  // 3. Render the child route component if authenticated
  return children;
}
