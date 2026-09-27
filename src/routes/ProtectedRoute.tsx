import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Placeholder protected route component.
 * As specified in architecture, no restrictive blocking auth logic is enforced yet
 * so all pages are immediately demo-able, but context hooks are wired for backend swap.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // In demo mode, permit full seamless navigation
  return <>{children}</>;
};
