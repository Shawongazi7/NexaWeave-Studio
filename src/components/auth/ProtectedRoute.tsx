import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AuthDialog } from './AuthDialog';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = React.useState(false);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, show auth dialog
  if (!isAuthenticated) {
    return (
      <>
        <AuthDialog 
          open={true} 
          onOpenChange={(open) => {
            if (!open) {
              // Redirect to home if dialog is closed without authentication
              window.location.href = '/';
            }
          }} 
        />
      </>
    );
  }
  
  // If authenticated, render children
  return <>{children}</>;
}