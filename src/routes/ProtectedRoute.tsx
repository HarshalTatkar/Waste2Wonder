import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Blocks unauthenticated users and redirects them to /login.
 * Preserves the intended destination so they can be sent back after login.
 * While auth state is loading, shows a non-blocking placeholder.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While Supabase is restoring the session from localStorage, show a loader
  // instead of flashing the login page
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-black text-black/60">Loading…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the page the user tried to visit
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};
