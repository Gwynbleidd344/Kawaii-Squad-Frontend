import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { Role, IdentityStatus } from '../types/index';

interface AuthLayoutProps {
  requireAdmin?: boolean;
  requireConfirmed?: boolean;
}

/**
 * AuthLayout - Protected route wrapper
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
      <div className="min-h-screen bg-[var(--slate-50)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[var(--slate-200)] border-t-[var(--brand-600)] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[var(--slate-500)] font-medium">Loading…</p>
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

  return <Outlet />;
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
