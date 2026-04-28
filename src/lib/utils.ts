/**
 * Utility functions for auth and API operations
 */

import { IdentityStatus } from '../types/index';

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format datetime to readable string
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get human-readable status message
 */
export function getStatusMessage(status: IdentityStatus): string {
  const messages = {
    [IdentityStatus.PENDING]: 'Your identity is under review by our admins',
    [IdentityStatus.CONFIRMED]: 'Your identity has been confirmed',
    [IdentityStatus.REJECTED]: 'Your identity was rejected',
  };
  return messages[status];
}

/**
 * Get status color for styling
 */
export function getStatusColor(status: IdentityStatus): string {
  const colors = {
    [IdentityStatus.PENDING]: 'yellow',
    [IdentityStatus.CONFIRMED]: 'green',
    [IdentityStatus.REJECTED]: 'red',
  };
  return colors[status];
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get initials from full name
 */
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

/**
 * Format file size to readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if file is valid image
 */
export function isValidImageFile(file: File): {
  valid: boolean;
  errors: string[];
} {
  const errors = [];
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, or WebP formats are allowed');
  }

  if (file.size > maxSize) {
    errors.push(`File size must be less than 5 MB (current: ${formatFileSize(file.size)})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Store token in localStorage
 */
export function saveAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

/**
 * Get token from localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Clear token from localStorage
 */
export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}

/**
 * Decode JWT to get payload (basic decoding, not verification)
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if JWT is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expirationTime;
}

/**
 * Format rejection reason
 */
export function formatRejectionReason(reason: string | null | undefined): string {
  if (!reason) return 'No reason provided';
  return reason;
}
