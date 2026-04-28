/**
 * Types generated from Digital Identity API OpenAPI 3.1.0
 */

// ============================================================================
// Enums
// ============================================================================

export enum IdentityStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// ============================================================================
// User Types
// ============================================================================

export interface UserPublic {
  id: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  email: string;
  idPhotoUrl: string | null;
  role: Role;
  status: IdentityStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Pagination
// ============================================================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============================================================================
// Error Responses
// ============================================================================

export interface ErrorResponse {
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  message: string;
  errors: ValidationError[];
}

// ============================================================================
// Auth Endpoints Request/Response
// ============================================================================

export interface RegisterRequest {
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string; // YYYY-MM-DD
  placeOfBirth: string;
  email: string;
  password: string;
  idPhoto: File;
}

export interface RegisterResponse {
  message: string;
  user: UserPublic;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserPublic;
}

export interface LoginErrorResponse {
  message: string;
  status: IdentityStatus;
  reason: string | null;
}

export interface GetMeResponse {
  user: UserPublic;
}

export interface UserStatusResponse {
  status: IdentityStatus;
  rejectionReason: string | null;
}

// ============================================================================
// Admin Endpoints Request/Response
// ============================================================================

export interface CreateAdminRequest {
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string; // YYYY-MM-DD
  placeOfBirth: string;
  email: string;
  password: string;
}

export interface CreateAdminResponse {
  message: string;
  admin: UserPublic;
}

export interface PendingIdentitiesResponse {
  data: UserPublic[];
  pagination: Pagination;
}

export interface AllIdentitiesResponse {
  data: UserPublic[];
  pagination: Pagination;
}

export interface IdentityDetailResponse {
  data: UserPublic;
}

export interface ApproveIdentityResponse {
  message: string;
  user: UserPublic;
}

export interface RejectIdentityRequest {
  reason: string;
}

export interface RejectIdentityResponse {
  message: string;
  user: UserPublic;
}

// ============================================================================
// Health Check
// ============================================================================

export interface HealthResponse {
  status: string;
}

// ============================================================================
// CIN (Carte d'Identité Nationale)
// ============================================================================

export interface CinOwner {
  id: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  email: string;
  status: 'CONFIRMED';
  idPhotoUrl: string | null;
}

export interface CinResponse {
  cinId: string;
  cinPhotoUrl: string;
  issuedAt: string;
  updatedAt: string;
  owner: CinOwner;
}

export interface CreateCinResponse {
  message: string;
  cin: CinResponse;
}

export interface GetCinResponse {
  cin: CinResponse;
}

// ============================================================================
// Auth Store State
// ============================================================================

export interface AuthState {
  user: UserPublic | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
