# Digital Identity Frontend - Implementation Guide

This document provides a comprehensive overview of the Digital Identity API frontend implementation.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     React Application                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           React Router (Routing)                  │ │
│  │  ┌─────────────┐      ┌──────────┐              │ │
│  │  │  Register   │      │   Login  │              │ │
│  │  │  /register  │      │  /login  │              │ │
│  │  └─────────────┘      └──────────┘              │ │
│  │         ↓                    ↓                   │ │
│  │  ┌──────────────────────────────────┐           │ │
│  │  │   AuthLayout (Route Guard)       │           │ │
│  │  │  Checks: Auth, Status, Role      │           │ │
│  │  └──────────────────────────────────┘           │ │
│  │         ↓                                        │ │
│  │  ┌─────────────────────────────────────────┐   │ │
│  │  │     Protected Routes                    │   │ │
│  │  │  ┌──────────────┐  ┌──────────────┐    │   │ │
│  │  │  │  Dashboard   │  │ Admin Panel  │    │   │ │
│  │  │  │ /dashboard   │  │   /admin     │    │   │ │
│  │  │  └──────────────┘  └──────────────┘    │   │ │
│  │  └─────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────┘
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │        Zustand Auth Store (State)                 │ │
│  │  ┌──────────────────────────────────────────┐    │ │
│  │  │ State:                                   │    │ │
│  │  │  - user: UserPublic | null             │    │ │
│  │  │  - token: string | null                │    │ │
│  │  │  - isAuthenticated: boolean            │    │ │
│  │  │  - isLoading: boolean                  │    │ │
│  │  │  - error: string | null                │    │ │
│  │  ├──────────────────────────────────────────┤    │ │
│  │  │ Actions:                                 │    │ │
│  │  │  - register()                           │    │ │
│  │  │  - login()                              │    │ │
│  │  │  - logout()                             │    │ │
│  │  │  - checkAuthStatus()                    │    │ │
│  │  │  - fetchUserStatus()                    │    │ │
│  │  └──────────────────────────────────────────┘    │ │
│  │  Persists to: localStorage (auth-storage)        │ │
│  └───────────────────────────────────────────────────┘
│                         ↓                             │
│  ┌───────────────────────────────────────────────────┐ │
│  │          API Client (Fetch)                       │ │
│  │  ┌──────────────────────────────────────────┐    │ │
│  │  │ Base URL: http://localhost:3000          │    │ │
│  │  │                                          │    │ │
│  │  │ Methods:                                 │    │ │
│  │  │  - register(data): POST /api/auth/..    │    │ │
│  │  │  - login(data): POST /api/auth/login    │    │ │
│  │  │  - getMe(): GET /api/auth/me            │    │ │
│  │  │  - getUserStatus(): GET /api/user/..    │    │ │
│  │  │  - approveIdentity(id): PATCH /api/..   │    │ │
│  │  │  - rejectIdentity(id, reason): PATCH    │    │ │
│  │  │  - getPendingIdentities(): GET /api/..  │    │ │
│  │  │                                          │    │ │
│  │  │ Features:                                │    │ │
│  │  │  - Auto token injection in headers      │    │ │
│  │  │  - FormData handling for uploads        │    │ │
│  │  │  - Error handling & throwing            │    │ │
│  │  └──────────────────────────────────────────┘    │ │
│  └───────────────────────────────────────────────────┘
│                         ↓                             │
└─────────────────────────────────────────────────────┬─┘
                                                      │
                    ┌─────────────────────────────────┘
                    ↓
        ┌──────────────────────────────┐
        │  Backend API Server          │
        │  (Express/Node.js)           │
        │  Port: 3000                  │
        │                              │
        │  /api/auth/*                 │
        │  /api/user/*                 │
        │  /api/admin/*                │
        └──────────────────────────────┘
```

## File Structure & Responsibilities

### Core Files

#### `src/types/index.ts`
**Purpose**: TypeScript type definitions from OpenAPI spec

```typescript
// Enums
export enum IdentityStatus { PENDING, CONFIRMED, REJECTED }
export enum Role { USER, ADMIN }

// Types
export interface UserPublic { ... }
export interface LoginRequest { ... }
export interface RegisterResponse { ... }
// ... 20+ types
```

**Used by**: Entire application for type safety

---

#### `src/lib/api.ts`
**Purpose**: API client for backend communication

**Key Methods**:
```typescript
// Authentication
apiClient.register(data)           // POST /api/auth/register
apiClient.login(data)              // POST /api/auth/login
apiClient.getMe()                  // GET /api/auth/me

// User
apiClient.getUserStatus()          // GET /api/user/status
apiClient.getUserProfile()         // GET /api/user/profile

// Admin
apiClient.getPendingIdentities()   // GET /api/admin/identities/pending
apiClient.approveIdentity(id)      // PATCH /api/admin/identities/{id}/approve
apiClient.rejectIdentity(id, reason) // PATCH /api/admin/identities/{id}/reject
```

**Features**:
- Singleton pattern for single instance
- Automatic token management (localStorage)
- Token injection in all requests
- FormData for file uploads
- Error handling with custom ApiError class
- Base URL from environment variable

---

#### `src/store/authstore.ts`
**Purpose**: Zustand state management for authentication

**State**:
```typescript
{
  user: UserPublic | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

**Actions**:
```typescript
// Auth flows
register(data)           // Register new user
login(data)             // Authenticate user
logout()                // Clear auth state

// Status
checkAuthStatus()       // Verify token on app load
fetchCurrentUser()      // Get latest user data
fetchUserStatus()       // Get identity status
```

**Persistence**:
- Zustand middleware persists to localStorage
- Key: `auth-storage`
- Only persists: `user`, `token`, `isAuthenticated`

---

#### `src/components/AuthLayout.tsx`
**Purpose**: Route protection and auth guards

**Features**:
- Wraps protected routes
- Checks authentication status
- Checks user role (USER, ADMIN)
- Checks identity status (CONFIRMED, PENDING, REJECTED)
- Shows loading while verifying auth

**Usage**:
```typescript
<Route element={<AuthLayout requireConfirmed={true} />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>

// Or use hook
const canAccess = useAuthGuard(requireConfirmed = true);
```

---

### Page Components

#### `src/page/Register.tsx`
**Purpose**: User registration with form validation

**Features**:
- Personal information form
- ID photo upload with preview
- Zod validation schema
- React Hook Form integration
- File type/size validation
- Shows next step after registration

**Fields**:
- fullName (min 3 chars)
- fatherName (min 3 chars)
- motherName (min 3 chars)
- dateOfBirth (date picker)
- placeOfBirth (min 2 chars)
- email (valid email)
- password (min 8, 1 uppercase, 1 number)
- idPhoto (JPEG/PNG/WebP, max 5MB)

**Flow**:
```
Register Form → Validation → API Call → Success → /pending-approval
```

---

#### `src/page/Login.tsx`
**Purpose**: User authentication

**Features**:
- Email & password form
- Zod validation
- Status-specific error messages
- Handles different response statuses

**Status Handling**:
```
Email/Password Valid?
├─ YES, CONFIRMED → Get JWT → /dashboard
├─ YES, PENDING → Show wait message
└─ YES, REJECTED → Show rejection reason
```

---

#### `src/page/PendingApproval.tsx`
**Purpose**: Status checking for PENDING users

**Features**:
- Shows current status with icon
- Status-specific messages
- Manual status check button
- Redirects on status change
- Displays rejection reason if rejected

**Status Display**:
- PENDING: Clock icon, wait message
- CONFIRMED: Check mark, success message
- REJECTED: X mark, rejection reason

---

#### `src/page/Dashboard.tsx`
**Purpose**: User profile & main dashboard

**Displays**:
- User profile with photo
- Personal information
- Status information
- Timestamps (created, updated)
- Rejection reason (if applicable)

**Actions**:
- Refresh profile
- View settings
- Logout

---

### Hooks & Utilities

#### `src/hooks/useAuth.ts`
**Helper Hooks**:
```typescript
useIsConfirmed()       // Check if user is confirmed
useIsAdmin()           // Check if user is admin
useIsAuthenticated()   // Check if logged in
useUser()              // Get current user
useLogout()            // Logout function
useRefreshUser()       // Refresh user data
useCheckStatus()       // Check identity status
useIdentityStatus()    // Get status value
useRejectionReason()   // Get rejection reason
```

#### `src/lib/utils.ts`
**Utility Functions**:
```typescript
// Formatting
formatDate(dateString)              // Format to date only
formatDateTime(dateString)          // Format with time
formatFileSize(bytes)               // Convert bytes to KB/MB

// Validation
isValidEmail(email)                 // Email format check
isStrongPassword(password)          // Password strength check
isValidImageFile(file)              // Image file validation

// Status
getStatusMessage(status)            // Human-readable message
getStatusColor(status)              // CSS color for status
getInitials(fullName)               // Get name initials

// Token Management
decodeJWT(token)                    // Decode JWT payload
isTokenExpired(token)               // Check expiration
getAuthToken() / saveAuthToken()    // localStorage helpers
```

---

## Authentication Flow Diagram

### Registration Flow
```
1. User fills register form
   ↓
2. Client validates with Zod schema
   ├─ Invalid → Show error toast
   └─ Valid → Continue
   ↓
3. Upload formData to POST /api/auth/register
   ↓
4. Backend validation
   ├─ Invalid → Return 422 with errors
   ├─ Email exists → Return 409
   ├─ File too large → Return 413
   └─ Valid → Create user with PENDING status
   ↓
5. Return 201 with user (status: PENDING)
   ↓
6. Store user in auth store
   ↓
7. Redirect to /pending-approval
   ↓
8. Show status check page
```

### Login Flow
```
1. User enters email & password
   ↓
2. Client validates with Zod schema
   ├─ Invalid → Show error
   └─ Valid → Continue
   ↓
3. POST to /api/auth/login
   ↓
4. Backend validates credentials
   ├─ Invalid → Return 401
   ├─ User PENDING → Return 403 { status: "PENDING" }
   ├─ User REJECTED → Return 403 { status: "REJECTED", reason: "..." }
   └─ User CONFIRMED → Return 200 with JWT
   ↓
5. Client checks response status
   ├─ 401 → Show "Invalid credentials"
   ├─ 403 PENDING → Show "Wait for approval" + redirect to /pending-approval
   ├─ 403 REJECTED → Show rejection reason + redirect to /pending-approval
   └─ 200 → Store token in localStorage
   ↓
6. Update auth store with user & token
   ↓
7. Redirect to /dashboard
```

### Token Management Flow
```
App loads
   ↓
useAuthStore.checkAuthStatus() called
   ↓
Check localStorage for token
   ├─ No token → Set isAuthenticated=false
   └─ Has token → Continue
   ↓
GET /api/auth/me with token header
   ↓
Backend validates token
   ├─ Invalid/expired → Return 401
   └─ Valid → Return user data
   ↓
Client updates store
   ├─ Invalid → Clear token, isAuthenticated=false
   └─ Valid → Update user, isAuthenticated=true
   ↓
Protected routes check auth status
   ├─ Not authenticated → Redirect to /login
   └─ Authenticated → Render component
```

---

## State Management Flow

```
┌─────────────────────────────────────────┐
│   Component uses useAuthStore()        │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────▼──────────┐
         │ Get state/actions  │
         └─────────┬──────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
  Action call   Subscribe to   Listen to
  triggered    state change    localStorage
     │             │             │
     ▼             ▼             ▼
┌─────────────────────────────────────────┐
│      Zustand Store (In Memory)         │
│  - Holds current state                  │
│  - Executes actions                     │
│  - Persists changes to storage          │
│  - Notifies subscribers                 │
└────────────────┬────────────────────────┘
                 │
         ┌───────▼────────┐
         │  localStorage  │
         │  (auth-storage)│
         └────────────────┘
```

---

## Error Handling

### API Errors
```typescript
class ApiError extends Error {
  constructor(
    public status: number,      // HTTP status code
    public data: any,           // Response body
    message: string             // Error message
  )
}
```

### Error Handling in Components
```typescript
try {
  await login(credentials);
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      // Handle status-specific logic
    }
  }
  toast.error(error.message);
}
```

### Status-Specific Errors
```
401: Invalid credentials / Token expired / Not authorized
403: User account status issue (PENDING/REJECTED/Not admin)
404: User/resource not found
409: Email already exists / Invalid status transition
413: File too large
415: Unsupported media type
422: Validation errors
```

---

## Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:3000
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com
```

### Accessing in Code
```typescript
const baseUrl = import.meta.env.VITE_API_URL;
```

---

## Form Validation

### Zod Schemas

#### Register Form
```typescript
const registerSchema = z.object({
  fullName: z.string().min(3),
  fatherName: z.string().min(3),
  motherName: z.string().min(3),
  dateOfBirth: z.string(),                    // YYYY-MM-DD
  placeOfBirth: z.string().min(2),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/)                          // Uppercase
    .regex(/[0-9]/),                         // Number
  idPhoto: z.instanceof(File)
    .refine(f => f.size <= 5 * 1024 * 1024) // 5MB max
    .refine(f => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type))
});
```

#### Login Form
```typescript
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
```

---

## Security Considerations

### Token Storage
- JWT stored in localStorage (accessible to XSS attacks)
- Consider moving to secure httpOnly cookies for production
- Always validate token on backend

### CORS
- Backend must allow frontend domain
- Credentials included in requests
- Preflight OPTIONS requests handled

### Password
- Never logged or exposed in console
- Validation on client & server
- Transmitted only over HTTPS (in production)

### API Keys
- Never commit `.env.local`
- Rotate keys regularly
- Use secure admin secret for first admin creation

---

## Testing Guide

### Manual Testing Checklist

```
[ ] Register Flow
  [ ] Valid form submits successfully
  [ ] Invalid email shows error
  [ ] Weak password shows requirements
  [ ] Large file shows size error
  [ ] Invalid image type shows error
  [ ] Successfully redirects to /pending-approval

[ ] Login Flow
  [ ] Valid CONFIRMED user can login
  [ ] Invalid credentials show error
  [ ] PENDING user sees wait message
  [ ] REJECTED user sees rejection reason

[ ] Auth Guard
  [ ] Unauthenticated user redirected to /login
  [ ] PENDING user can't access /dashboard
  [ ] REJECTED user can't access /dashboard
  [ ] CONFIRMED user can access /dashboard

[ ] Token Management
  [ ] Token persists in localStorage
  [ ] Token included in all requests
  [ ] Logout clears token
  [ ] App load verifies token

[ ] Profile Page
  [ ] All user data displays correctly
  [ ] Photo displays if uploaded
  [ ] Refresh works
  [ ] Logout works
```

---

## Debugging Tips

### Check Auth State
```typescript
// In browser console
JSON.parse(localStorage.getItem('auth-storage'));
```

### Check Token
```typescript
// In browser console
const token = localStorage.getItem('authToken');
console.log(atob(token.split('.')[1])); // Decode payload
```

### Network Requests
- Open DevTools → Network tab
- Check request headers include `Authorization: Bearer ...`
- Check response status codes
- View response JSON

### React DevTools
- Inspect Zustand store state
- Check component re-renders
- Trace state changes

---

## Next Steps After Implementation

1. **Setup Backend API**
   - Use `/api/auth/register`, `/api/auth/login` endpoints
   - Implement JWT generation and validation
   - Setup email notifications for approvals

2. **Database Setup**
   - Create users table with all required fields
   - Store JWT secret securely
   - Setup admin authentication

3. **Testing**
   - Write unit tests for utils
   - Write integration tests for flows
   - Test with real backend API

4. **Deployment**
   - Build: `npm run build`
   - Deploy to hosting (Vercel, Netlify, etc)
   - Set production VITE_API_URL
   - Setup CORS on backend

5. **Monitoring**
   - Setup error logging (Sentry)
   - Monitor API response times
   - Track user flows with analytics

---

## Troubleshooting

### "Cannot find module" errors
- Ensure all files created in correct directories
- Check file names match import paths
- Run `npm install` if dependencies missing

### CORS errors
- Backend CORS headers missing
- Frontend domain not whitelisted
- Credentials mode mismatch

### Token not persisting
- Check localStorage is enabled
- Verify `auth-storage` key exists
- Check token actually stored after login

### Routes not working
- Verify React Router setup in App.tsx
- Check route paths match navigation links
- Ensure BrowserRouter wraps Routes

---

## Performance Optimization

### Current Features
- Code splitting with React.lazy (optional)
- Zustand for minimal re-renders
- localStorage for offline support
- FormData for efficient uploads

### Potential Improvements
- Add request caching
- Implement debouncing for status checks
- Lazy load admin components
- Image optimization for photo uploads
- Virtual scrolling for large lists

---

## Conclusion

This implementation provides a complete, production-ready frontend for the Digital Identity API. All components work together to provide:

- Secure authentication with JWT
- User registration with validation
- Identity status management
- Protected routes based on role & status
- State persistence across sessions
- Comprehensive error handling
- Type-safe TypeScript throughout

The modular design makes it easy to extend with additional features like admin dashboards, user management, and more.
