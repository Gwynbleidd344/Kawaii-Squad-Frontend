import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { Role, IdentityStatus } from '../types/index';
import { AppLayout } from './AppLayout';
import { Spinner } from './ui/Spinner';

interface AuthLayoutProps {
  requireAdmin?: boolean;
  requireConfirmed?: boolean;
}

/**
 * AuthLayout - Protected route wrapper
 * Wraps protected routes with AppLayout (sidebar + content area)
 * Checks authentication and user status before allowing access
 */
export function AuthLayout({
  requireAdmin = false,
  requireConfirmed = false,
}: AuthLayoutProps) {
  const { user, isAuthenticated, isLoading, checkAuthStatus } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Check auth status on mount
    if (!isAuthenticated && !isLoading) {
      checkAuthStatus();
    }
  }, [isAuthenticated, isLoading, checkAuthStatus]);

  // Still loading auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-sm text-[var(--text-muted)] font-medium">Chargement…</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin route but user is not admin
  if (requireAdmin && user.role !== Role.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  // Requires confirmed status but user is not confirmed
  if (requireConfirmed && user.status !== IdentityStatus.CONFIRMED) {
    return <Navigate to="/pending-approval" replace />;
  }

  // User is pending
  if (user.status === IdentityStatus.PENDING && requireConfirmed) {
    return <Navigate to="/pending-approval" replace />;
  }

  // User is rejected
  if (user.status === IdentityStatus.REJECTED && requireConfirmed) {
    return <Navigate to="/pending-approval" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

/**
 * Higher-order component for protecting routes
 */
export function ProtectedRoute({
  requireAdmin = false,
  requireConfirmed = false,
}: AuthLayoutProps) {
  return <AuthLayout requireAdmin={requireAdmin} requireConfirmed={requireConfirmed} />;
}

/**
 * Hook to check if user can access a resource
 */
export function useAuthGuard(requireAdmin = false, requireConfirmed = false): boolean {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) return false;
  if (requireAdmin && user.role !== Role.ADMIN) return false;
  if (requireConfirmed && user.status !== IdentityStatus.CONFIRMED) return false;

  return true;
}
