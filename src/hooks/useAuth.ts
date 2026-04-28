import { useCallback } from 'react';
import { useAuthStore } from '../store/authstore';
import { IdentityStatus, Role } from '../types/index';

/**
 * Hook to check if user has confirmed identity
 */
export function useIsConfirmed(): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.status === IdentityStatus.CONFIRMED;
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin(): boolean {
  const user = useAuthStore((state) => state.user);
  return user?.role === Role.ADMIN;
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated;
}

/**
 * Hook to get current user
 */
export function useUser() {
  return useAuthStore((state) => state.user);
}

/**
 * Hook to logout
 */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  return useCallback(logout, [logout]);
}

/**
 * Hook to refresh current user
 */
export function useRefreshUser() {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  return useCallback(() => fetchCurrentUser(), [fetchCurrentUser]);
}

/**
 * Hook to check identity status
 */
export function useCheckStatus() {
  const fetchUserStatus = useAuthStore((state) => state.fetchUserStatus);
  return useCallback(() => fetchUserStatus(), [fetchUserStatus]);
}

/**
 * Hook to get user identity status
 */
export function useIdentityStatus() {
  const user = useAuthStore((state) => state.user);
  return user?.status || null;
}

/**
 * Hook to get rejection reason
 */
export function useRejectionReason() {
  const user = useAuthStore((state) => state.user);
  return user?.rejectionReason || null;
}
